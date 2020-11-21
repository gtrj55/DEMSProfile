import * as React from 'react';
import styles from './Sitemap.module.scss';
import { ISitemapProps } from './ISitemapProps';
import { escape } from '@microsoft/sp-lodash-subset';
import './Sitemap.css';
import { SPComponentLoader } from "@microsoft/sp-loader";
import "bootstrap/dist/css/bootstrap.min.css";
import { SPOperation } from './SPOperation/SPService';
import { stringIsNullOrEmpty } from '@pnp/common';
import { ISiteMapState } from './ISiteMapState';

export default class Sitemap extends React.Component<ISitemapProps, ISiteMapState> {
  private spOps;
  constructor(props: ISitemapProps) {
    super(props);
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css");
    SPComponentLoader.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/js/bootstrap.min.js");
    SPComponentLoader.loadCss("https://code.jquery.com/jquery-1.11.1.min.js");
    this.spOps = new SPOperation(this.props.context);
    this.state = {
      //notificationHeader: "Welcome to Digital Engineering and Manufacturing Services Resources Microsite. This platform provides seamless access to the best fit resources to cater to your requirements. It augments the entire process of building and mobilizing teams cutting across skills, sectors, technologies, experience level and geographies. The Microsite is designed to support as a self service medium to ensure our users get to benefit its effectiveness."
      notificationHeader: ""
    };
  }
  public componentDidMount() {
    this.spOps.getSiteMapHeader().then((result: any) => {
      let _notificationHeader: string;
      _notificationHeader = result[0].Message;
      this.setState({ notificationHeader: _notificationHeader });
    });
  }
  public render(): React.ReactElement<ISitemapProps> {
    return (
      <div id="container">
        <div id="sitemapheader">
          <div id="sitemapheadertext">
            {this.state.notificationHeader}
          </div>
        </div>
        <div className="tree">
          <ul>
            <li>
              <a id="demsportal" href="#">DEMS Resource Portal</a>
              <ul>
                <li><a id="rmg" href="#">RMG</a>
                  <ul>
                    <li>
                      <a href="#" id="profilefeeding">Profile Feeding</a>
                    </li>
                    <li>
                      <a href="#" id="profileupdating">Profile Updating</a>
                    </li>
                    <li>
                      <a href="#" id="profiledeleting">Profile Deleting</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#" id="sales">USER</a>
                  <ul>
                    <li>
                      <a href="#" id="flatsearch">Flat Search</a>
                    </li>
                    <li>
                      <a href="#" id="advancedsearch">Advanced Search</a>
                    </li>
                  </ul>
                </li>
                <li><a id="admin" href="#">ADMIN</a>
                  <ul>
                    <li>
                      <a href="#" id="managingnotification">Managing Notification</a>
                    </li>
                    <li>
                      <a href="#" id="managingaccess">Managing Access</a>
                    </li>
                    <li>
                      <a href="#" id="notificationstream">Notification streamlining with multiple account executives</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
