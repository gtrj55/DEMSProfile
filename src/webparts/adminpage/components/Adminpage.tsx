import * as React from 'react';
import styles from './Adminpage.module.scss';
import { IAdminpageProps } from './IAdminpageProps';
import { SPOperation } from './SPOperation/SPServices';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { IAdminpageState } from './IAdminpageState';
import { sp } from "@pnp/sp/presets/all";
import './AdminPage.css';
import { Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as moment from 'moment';
export default class Adminpage extends React.Component<IAdminpageProps, IAdminpageState, {}> {

  private spOps;
  constructor(props) {
    super(props);
    this.state = {
      Data: [{ Author: "" }],
      message: "",
      isActive: false,
      selectedNot: ''
    };
    sp.setup({
      ie11: true,
      sp: {
        baseUrl: this.props.context.pageContext.site.absoluteUrl
      }
    });
    this.spOps = new SPOperation(this.props.context);
  }

  public componentDidMount() {
    this.spOps.getNotification().then((result: any) => {
      console.log(result);
      this.setState({
        Data: result
      });
    });
    setInterval(() => {
      this.spOps.getNotification().then((result: any) => {
        //console.log(result);
        this.setState({
          Data: result
        });
      });
    }, 300000);
  }
  public componentDidUpdate() {

    var elems = document.querySelectorAll(".notificationSelect");
    [].forEach.call(elems, function (el) {
      el.classList.remove("notificationSelect");
    });

    if (this.state.selectedNot != "") {
      console.log(this.state.selectedNot);
      var element = document.getElementsByClassName(this.state.selectedNot)[0];
      element.classList.add("notificationSelect");
    }
  }

  private _ontoastHover(ev) {
    let ele = ev.currentTarget["children"][0]["children"][2];
    let timeEle = ev.currentTarget["children"][0]["children"][1];
    //let ele = document.querySelector<HTMLElement>(e);
    if (ele != null) {
      ele.style.display = "block";
      timeEle.style.display = "none";
    }
  }
  private _ontoastLeave(ev) {
    let ele = ev.currentTarget["children"][0]["children"][2];
    let timeEle = ev.currentTarget["children"][0]["children"][1];
    //let ele = document.querySelector<HTMLElement>(e);
    if (ele != null) {
      ele.style.display = "none";
      timeEle.style.display = "block";
    }
  }

  public handleNotify(data, ev) {
    //console.log(ev.currentTarget);
    //remove active
    // var e = ev.currentTarget.parentElement.children;
    // for (let index = 0; index < e.length; index++) {
    //   let element = e[index];
    //   element.classList.remove("notificationSelect");      
    // }
    //Add active 
    // var currEle = ev.currentTarget;
    // currEle.classList.add("notificationSelect");
    this.setState({
      message: data.Message,
      isActive: !this.state.isActive,
      selectedNot: "NotifiBox" + data.Id
    }, () => {
      if (!data.Read) {
        this.spOps.UpdateReadNotification(data.Id).then((result: string) => {
          this.setState({
            Data: this.state.Data.map(el => (el.Id === result ? { ...el, Read: true } : el))
          });
        });
      }
    });

  }

  public handleClose(data) {
    this.spOps.deleteNotification(data.Id).then((result: string) => {
      //console.log(result);
      let Data = this.state.Data.filter(i => i.Id != Number(result));
      //console.log(Data);
      this.setState({
        Data,
        message: "",
        selectedNot: ""
      });
    });
  }
  public render(): React.ReactElement<IAdminpageProps> {
    return (
      <div className={styles.adminpage}>
        <div className="container-fluid">
          <div className="row addstyle">
          <div className="col-md-4 notifyTab">
              <div className="notHead">Notification</div>
              <hr />
              <div className="scrollbarStyleInner">
                {
                  this.state.Data.map((data, indcar) => {
                    //className={data.Read ? "" : "notificationUnReadBorder NotifiBox"+data.Id}
                    return (
                      <Toast className={data.Read ? "NotifiBox" + data.Id : "notificationUnReadBorder NotifiBox" + data.Id} key={data.Id_div} onMouseLeave={this._ontoastLeave} onMouseEnter={this._ontoastHover} onClick={(ev) => { this.handleNotify(data, ev); }} onClose={() => { this.handleClose(data); }}>
                        <Toast.Header>
                          {data.Read ? <strong style={{ fontSize: "16px" }}>{data.Author.Title}</strong> : <strong className={data.Read ? "" : "notificationUnRead"}>{data.Author.Title}</strong>}
                          {data.Read ? <small style={{ fontSize: "13px", position: "absolute", right: "5px" }}>{moment(data.Created).fromNow()}</small> : <small style={{ fontSize: "13px", position: "absolute", right: "5px" }} className={data.Read ? "" : "notificationUnRead"}>{moment(data.Created).fromNow()}</small>}
                        </Toast.Header>
                        <Toast.Body>{data.Message?data.Message.replace( /(<([^>]+)>)/ig, ''):null}</Toast.Body>
                      </Toast>
                    );
                  }
                  )
                }
              </div>
            </div>
            <div className="col-md-8 classSize8">
              <div className="notification_icon">
                {this.state.message?<div className="notificationMessage"  dangerouslySetInnerHTML={{ __html: this.state.message }} />:
                 <div className="notification_icon1">
              <div className="notificationMessage1"><div><img src={this.props.context.pageContext.site.absoluteUrl+"/SiteCollectionImages/select.png"}></img></div>
                <div><b>Select an item to read</b></div>
                <div className="NothingisSelected"><span>Nothing is selected</span></div></div>
              </div>}
              </div>
            </div>
         
          </div>
        </div>
      </div>
    );
    function displayCreatedTime(e) {
      e.target.style.background = 'red';
    }
  }
}
