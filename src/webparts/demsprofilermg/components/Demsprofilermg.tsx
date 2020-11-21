//import "@pnp/polyfill-ie11";
import * as React from 'react';
import styles from './Demsprofilermg.module.scss';
import { IDemsprofilermgProps } from './IDemsprofilermgProps';
import { IDemsprofilermgState } from './IDemsprofilermgState';
import { escape, constant } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from "@microsoft/sp-loader";
import { ActionButton, IButtonStyles, Icon, IIconStyles, Image, Persona, Stack, IStackTokens, TextField } from 'office-ui-fabric-react';
import { ImageFit } from 'office-ui-fabric-react/lib/Image';
import { ISize } from 'office-ui-fabric-react/lib/Utilities';
// import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { DetailsList, DetailsListLayoutMode, SelectionMode, ConstrainMode, IColumn } from 'office-ui-fabric-react';
import { CommandBarButton, IContextualMenuProps, IIconProps } from 'office-ui-fabric-react';
import { mergeStyles, mergeStyleSets, FontWeights } from 'office-ui-fabric-react/lib/Styling';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import './Demsprofilermg.css';
import { SearchBox, ISearchBoxStyles } from 'office-ui-fabric-react/lib/SearchBox';
import { initializeIcons } from '@uifabric/icons';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Pivot, PivotItem, PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import { sp } from "@pnp/sp/presets/all";
import ProgressBarComponent from "./ProgressBarComponent";
import * as $ from 'jquery';
import * as XLSX from 'xlsx';


const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 200 } };
let tempAllItems = [];
let thisduplicate;
export default class Demsprofilermg extends React.Component<IDemsprofilermgProps, IDemsprofilermgState> {
  constructor(props) {
    super(props);
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css");
    SPComponentLoader.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
    SPComponentLoader.loadCss("https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css");
    SPComponentLoader.loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.7.7/xlsx.core.min.js');
    //SPComponentLoader.loadCss(props.context.pageContext.web.absoluteUrl + '/Shared%20Documents/Admin.css');

    thisduplicate = this;
    this.state = {
      Items: [],
      progressPercentage: 0,
      HideShow: false,
      buttonText: "Upload to Profile Database",
      buttonDisabled:true
    };
    initializeIcons();
    this.ExportToTable=this.ExportToTable.bind(this);    
    this.ResultCollection1 = this.ResultCollection1.bind(this);
    
    sp.setup({
      ie11: true,
      sp: {
        //baseUrl:this.props.spSiteUrl != "" ? this.props.spSiteUrl  : this.props.context.pageContext.site.absoluteUrl  
        baseUrl: this.props.context.pageContext.site.absoluteUrl
        //baseUrl:"https://gautamtestsite3.sharepoint.com/"
        //baseUrl:this.props.spSiteUrl

      }
    });
  }

  // public mypnpcheck() {
  //   this.setState({
  //     progressPercentage: 0,
  //     HideShow: true,
  //     buttonText: "Uploading to Profile Database"
  //   });
  //   //sp.web.getFileByServerRelativeUrl("/sites/DEMSMicrositetest/Shared%20Documents/Data.xlsx").getBuffer().then((buffer: ArrayBuffer) => {
  //     sp.web.getFileByServerRelativeUrl(this.props.context.pageContext.web.serverRelativeUrl + "/Shared%20Documents/Data.xlsx").getBuffer().then((buffer: ArrayBuffer) => {
       
  //     var workbook = XLSX.read(buffer, {
  //       type: "buffer"
  //     });
  //     var first_sheet_name = workbook.SheetNames[0];
  //     var worksheet = workbook.Sheets[first_sheet_name];
  //     var headers = {};
  //     var data = [];
  //     let z: any;
  //     for (z in worksheet) {
  //       if (z[0] === '!') continue;
  //       var tt = 0;
  //       for (var i = 0; i < z.length; i++) {
  //         if (!isNaN(z[i])) {
  //           tt = i;
  //           break;
  //         }
  //       }
  //       var col = z.substring(0, tt);
  //       var row = parseInt(z.substring(tt));
  //       var value = worksheet[z].v;
  //       //store header names  
  //       if (row == 1 && value) {
  //         if(value=="Global Group ID") value="Global_x0020_Group_x0020_ID"
  //         else if(value=="Employee no") value="Employee_x0020_no"
  //         else if(value=="Local Grade") value="Local_x0020_Grade"
  //         else if(value=="Primary Skill") value="Skills"
  //         else if(value=="User Name") value="User_x0020_Name"
  //         else if(value=="Skill Details") value="Skill_x0020_Details"
  //         else if(value=="Skill Group") value="Skill_x0020_Group"
  //           headers[col] = value;  
  //           continue;  
  //       }  
  //       if (!data[row]) data[row] = {};
  //       if(headers[col]!="YOE")
  //       value=value.toString();
  //       else
  //       value = Number(value.replace(/\D/g, ""));
  //       data[row][headers[col]] = value;
  //     }
  //     var EmpNoExcel = [];
  //     const arrFiltered = data.filter(el => {
  //       if (el != null && el != '')
  //         EmpNoExcel.push(el.Employee_x0020_no);
  //       return el != null && el != '';
  //     });
  //     console.log(EmpNoExcel);
  //     console.log(arrFiltered);
  //     var percentCalculate = 100 / arrFiltered.length;
  //     this.ResultCollection1(arrFiltered, EmpNoExcel, percentCalculate);
  //   });


  // }
  public checkFileExist=(e)=>{
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;

    this.setState({
     buttonDisabled:e.target.files.length>0?e.target.files[0].name?!regex.test(e.target.files[0].name.toLowerCase()):true:true
    });
  }
  public ExportToTable=()=> {
    var exportToTab=this;
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        let excelExportValueG:string=String($("#excelfile").val());
        this.setState({
          buttonDisabled:true
        });
        if (regex.test(excelExportValueG.toLowerCase())) {
            var xlsxflag = false;
  
            if (excelExportValueG.toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e:Event) {
                 
                    //var data = e.target.result;
                    var data= reader.result;
                    if (xlsxflag) {
                        var workbook = XLSX.read(data, { type: 'binary' });
                    }
  
                    var sheet_name_list = workbook.SheetNames;
                    var cnt = 0;
                    sheet_name_list.forEach(function (y) {
                        if (xlsxflag) {
                            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        }
  
                        if (exceljson.length > 0 && cnt == 0) {
                          var gidNoExcel=[];
                          const arrFiltered:any = exceljson.filter((el:any) => {
                            if(el != null && el != '')
                            gidNoExcel.push(el["Global Group ID"]);          
                            return el != null && el != '';
                          });
                          var percentCalculate = 100/arrFiltered.length;
                          const dataMain = arrFiltered.map( item => {
                            item.YOE=item.YOE?typeof(item.YOE)!="number"?Number(item.YOE.replace(/\D/g, "")):item.YOE:0;
                            const { ['Global Group ID']: Global_x0020_Group_x0020_ID,['Employee no']: Employee_x0020_no,['Local Grade']: Local_x0020_Grade,['Primary Skill']: Skills,['User Name']: User_x0020_Name,['Skill Details']: Skill_x0020_Details,['Skill Group']: Skill_x0020_Group, ...rest } = item;
                            return { Global_x0020_Group_x0020_ID,Employee_x0020_no,Local_x0020_Grade,Skills,User_x0020_Name,Skill_x0020_Details,Skill_x0020_Group, ...rest };
                           }
                          );
                            exportToTab.ResultCollection1(dataMain,gidNoExcel,percentCalculate);                        
                        }
                    });
                };
                
                if (xlsxflag) {
                  this.setState({
                    progressPercentage:1,
                    HideShow:true,
                    buttonText:"Uploading Profiles"
                  });
                  let fileCheck:any = $("#excelfile")[0] as HTMLElement;
                    reader.readAsArrayBuffer(fileCheck.files[0]);
                    //this.myCheck(fileCheck.files[0])
                }
                
            }
            else {
                $('#loading').hide();
                alert("Sorry! Your browser does not support HTML5!");
            }
        }
        else {
            $('#loading').hide();
            alert("Please upload a valid Excel file!");
        }
    }

  // public ResultCollection1(ObjColl, EmpNoExcel, percentCalculate): Promise<any> {
  //   let collectionOfItem: any[] = [];
  //   return new Promise<any>(async (resolve, reject) => {

  //     for (let queryi of ObjColl) {
  //       // get list items
  //       const item: any = await sp.web.lists.getByTitle("GautamEmp1").items.top(1).filter("Employee_x0020_no eq '" + queryi.Employee_x0020_no + "'").get();
  //       console.log(item);
  //       if (item.length > 0) {
  //         const updateListItem = await sp.web.lists.getByTitle("GautamEmp1").items.getById(item[0].Id).update(queryi);
  //         console.log(updateListItem);
  //       }
  //       else {
  //         await sp.web.lists.getByTitle('GautamEmp1').items.add(queryi).then((results: any) => {
  //           resolve("Data " + results.data.ID + "has been successfully feded");
  //         }, (error) => console.log(error));
  //       }
  //       this.setState({
  //         progressPercentage: this.state.progressPercentage + Math.floor(percentCalculate)
  //       });
  //     }
  //     const items: any = await sp.web.lists.getByTitle("GautamEmp1").items.top(1000).get();
  //     console.log(items);
  //     var EmpNoExcel1 = [];
  //     items.map(el => {
  //       EmpNoExcel1.push(el.Employee_x0020_no);
  //     });
  //     const DeleteArray = EmpNoExcel1.filter(element => EmpNoExcel.indexOf(element) == -1);
  //     let DeleteArrayById = DeleteArray.map(da => items.filter(e => e.Employee_x0020_no == da));
  //     DeleteArrayById = DeleteArrayById.map(e => e[0].Id);
  //     console.log(DeleteArrayById);
  //     for (let queryi of DeleteArrayById) {
  //       const item: any = await sp.web.lists.getByTitle("GautamEmp1").items.getById(queryi).delete();
  //       console.log(item);
  //     }
  //     this.setState({
  //       progressPercentage: 100,
  //       HideShow: false,
  //       buttonText: "Uploaded to Profile Database"
  //     });
  //   });
  // }
  public ResultCollection1(ObjColl,gidNoExcel,percentCalculate):Promise<any>{ 
    let collectionOfItem:any[]=[];
    let listName="EmpStage";

    
    return new Promise<any>(async(resolve,reject)=>{      
      const AllItems: any = await sp.web.lists.getByTitle(listName).items.top(5000).get();
      var percentCalculate = 80 / AllItems.length;
      const AddResults = ObjColl.filter(({ Global_x0020_Group_x0020_ID:id1 }) => !AllItems.some(({ Global_x0020_Group_x0020_ID: id2 }) => id2 === id1));
      var UpdateResults = ObjColl.filter(({ Global_x0020_Group_x0020_ID:id1 }) => !AddResults.some(({ Global_x0020_Group_x0020_ID: id2 }) => id2 === id1));
      console.log($.map(UpdateResults, function(post){
      let user = $.grep(AllItems, function(user:any){
          return user.Global_x0020_Group_x0020_ID === post.Global_x0020_Group_x0020_ID;
      })[0];      
        post.Id = user.Id;
        return post;
      }));

      for (let queryi of UpdateResults) {
          const updateListItem = await sp.web.lists.getByTitle(listName).items.getById(queryi.Id).update(queryi);
          this.setState({
            progressPercentage:this.state.progressPercentage + Math.floor(percentCalculate)
          });
      }
      for (let queryi of AddResults) {
        await sp.web.lists.getByTitle(listName).items.add(queryi).then((results:any)=>{          
          this.setState({
            progressPercentage:this.state.progressPercentage + Math.floor(percentCalculate)
          });          
          resolve("Data "+results.data.ID+ "has been successfully feded");
      },(error)=>console.log(error));           
    }

      
  //   for (let queryi of ObjColl) {  
  //   // get list items
  //   const item: any = await sp.web.lists.getByTitle("GautamEmp1").items.top(1).filter("Employee_x0020_no eq '"+queryi.Employee_x0020_no+"'").get();
  //   console.log(item);
  //   if(item.length>0){
  //     const updateListItem = await sp.web.lists.getByTitle("GautamEmp1").items.getById(item[0].Id).update(queryi);
  //     console.log(updateListItem)
  //   }
  //   else{
  //      await sp.web.lists.getByTitle('GautamEmp1').items.add(queryi).then((results:any)=>{
  //                 resolve("Data "+results.data.ID+ "has been successfully feded");
  //             },(error)=>console.log(error))
  //   }  
  // //resolve(item)
  // this.setState({
  //   progressPercentage:this.state.progressPercentage+Math.floor(percentCalculate)
  // })
  // }
  const items: any = await sp.web.lists.getByTitle(listName).items.top(1000).get();
    var gidNoExcel1=[];
    items.map(el => {             
      gidNoExcel1.push(el.Global_x0020_Group_x0020_ID);
    });
    const DeleteArray = gidNoExcel1.filter(element => gidNoExcel.indexOf(element) == -1);
    let DeleteArrayById=DeleteArray.map(da=>items.filter(e=>e.Global_x0020_Group_x0020_ID==da));    
    DeleteArrayById=DeleteArrayById.map(e=>e[0].Id);
    percentCalculate = 20 / DeleteArrayById.length;
    for (let queryi of DeleteArrayById) {  
      const item: any = await sp.web.lists.getByTitle(listName).items.getById(queryi).delete();
      this.setState({
        progressPercentage:this.state.progressPercentage+Math.floor(percentCalculate)
      });      
    }
    for(let queryi of DeleteArray){
      await sp.web.getFileByServerRelativePath("/sites/ERNDBenchPortal/ProfileDatabase/"+queryi+".pdf").recycle();
    }

    this.setState({
      progressPercentage:100,
      buttonDisabled:false,      
      buttonText:"Successfully uploaded all the profile"
    });
    });
  } 

  public componentDidMount() {
    this.getprofileDetails();
  }

  public getprofileDetails() {
    sp.web.lists.getByTitle("EmpStage").items.get().then(results => {
      let finalresults: any[] = [], resultsobj: any = {};
      results.forEach(element => {
        resultsobj = {
          Name: element.Name,
          Skills: element.Skills,
          Geography: element.City,
          SystemName: element.Global_x0020_Group_x0020_ID,
          Experience: element.YOE == null ? "" : (element.YOE) + (element.YOE > 1 ? " Yrs." : "Yr"),
          Sector: element.Domain == null ? "" : element.Domain
        };
        finalresults.push(resultsobj);
      });
      tempAllItems = finalresults;
      this.setState({
        Items: finalresults
      });
    }, errQL => {
      console.log(errQL);
    });
  }

  private _buildColumns(): IColumn[] {
    let _columns: IColumn[] = [/*{ key: '', name: '', fieldName: '', minWidth: 10, maxWidth: 80, isResizable: true }*/];
    let Name: IColumn = { key: 'Name', name: 'Name', fieldName: 'Name', minWidth: 120, maxWidth:150,  isResizable: true, isRowHeader: true, isSorted: false, isSortedDescending: false, sortAscendingAriaLabel: 'Sorted A to Z', sortDescendingAriaLabel: 'Sorted Z to A', data: 'string' };
    let SystemName: IColumn = { key: 'SystemName', name: 'System Name', fieldName: 'SystemName', minWidth: 60,maxWidth:80,  isResizable: true, isRowHeader: true, isSorted: false, isSortedDescending: false, sortAscendingAriaLabel: 'Sorted A to Z', sortDescendingAriaLabel: 'Sorted Z to A', data: 'string'};
    let Skills: IColumn = { key: 'Skills', name: 'Skills', fieldName: 'Skills', minWidth: 240, maxWidth:300,  isResizable: true, isRowHeader: true, isSorted: false, isSortedDescending: false, sortAscendingAriaLabel: 'Sorted A to Z', sortDescendingAriaLabel: 'Sorted Z to A', data: 'string' };
    let Experience: IColumn = { key: 'Experience', name: 'Experience', fieldName: 'Experience', minWidth: 50,maxWidth: 60, isResizable: true, isRowHeader: true, isSorted: false, isSortedDescending: false, sortAscendingAriaLabel: 'Sorted A to Z', sortDescendingAriaLabel: 'Sorted Z to A', data: 'string' };
    let Sector: IColumn = { key: 'Sector', name: 'Sector', fieldName: 'Sector', minWidth: 80,maxWidth:120, isResizable: true, isRowHeader: true, isSorted: false, isSortedDescending: false, sortAscendingAriaLabel: 'Sorted A to Z', sortDescendingAriaLabel: 'Sorted Z to A', data: 'string' };
    let Geography: IColumn = { key: 'Geography', name: 'Geography', fieldName: 'Geography', minWidth: 60,maxWidth:80, isResizable: true, isRowHeader: true, isSorted: false, isSortedDescending: false, sortAscendingAriaLabel: 'Sorted A to Z', sortDescendingAriaLabel: 'Sorted Z to A', data: 'string' };
    _columns.push(Name);
    _columns.push(SystemName);
    _columns.push(Skills);
    _columns.push(Experience);
    _columns.push(Sector);
    _columns.push(Geography);
    return _columns;
  }


  public _renderItemColumn(linkitem: any, index: number, column: IColumn, obj) {
    switch (column.key) {
      case 'Name':
        return (<label>{linkitem.Name}</label>);
      case 'SystemName':
        return (<label>{linkitem.SystemName}</label>);
      case 'Skills':
        return (<label>{linkitem.Skills}</label>);
      case 'Experience':
        return (<label>{linkitem.Experience}</label>);
      case 'Sector':
        return (<label>{linkitem.Sector}</label>);
      case 'Geography':
        return (<label>{linkitem.Geography}</label>);
      default: return null;
    }
  }


  public render(): React.ReactElement<IDemsprofilermgProps> {
    const { Items } = this.state;
    const testData = [
      //{ bgcolor: "#00695c", completed: this.state.progressPercentage }
      { bgcolor: "#2A74B3", completed: this.state.progressPercentage }
    ];
    return (
      <div className={"rmgdetailed "+styles.demsprofilermg}>
        <Pivot aria-label="Large Link Size Pivot Example" linkSize={PivotLinkSize.large}>
          <PivotItem headerText="Resources">
            <div className={styles.container} >
              <div><SearchBox className="controlStyles"
                styles={searchBoxStyles}
                placeholder="Search"
                onClear={ev => {
                  this.setState({
                    Items: tempAllItems,
                  });
                }}
                onSearch={newValue => this._onChange(newValue)}
              /></div>
              <div className='link-header-row ms-Grid-row tabrow scrollbarStyleInner'>
                <DetailsList items={Items}
                  columns={this._buildColumns()}
                  onRenderItemColumn={(linkitem, index, column) => this._renderItemColumn(linkitem, index, column, this)}
                  selectionMode={SelectionMode.none}
                  constrainMode={ConstrainMode.unconstrained}
                  compact={true}
                  // className='disa-linkdetailslist scrollbarStyleInner'
                  
                  setKey="none"
                  layoutMode={DetailsListLayoutMode.justified}
                  isHeaderVisible={true}
                />
              </div>
            </div>
          </PivotItem>
          <PivotItem headerText="Upload">
            <div className={styles.uploadDiv}>
          <input type="file" id="excelfile" onChange={(e)=>this.checkFileExist(e)}/>
  <input type="button" className={styles.mybutton} id="viewfile" value="Export To Profile Database" onClick={this.ExportToTable} disabled={this.state.buttonDisabled} /> <br /><br />

            <div className="upload">
              {/* {!this.state.HideShow ?
                <button className={styles.primary} type="button" onClick={this.mypnpcheck}>{this.state.buttonText}</button> :
                <button className={styles.primary} type="button" disabled>{this.state.buttonText}</button>
              } */}
              {this.state.HideShow ? <div>
                {/* <div className='uploadProgress'>Uploading to the List...</div>  */}
                <h5>{this.state.buttonText}</h5>
                <div className="progressBarExcel">
                  {testData.map((item, idx) => (
                    <ProgressBarComponent key={idx} bgcolor={item.bgcolor} completed={item.completed} />
                  ))}
                </div>
              </div> : <div></div>
              }
            </div>
            </div>
          </PivotItem>
        </Pivot>
      </div>
    );
  }
  private _onChange = (text: any): void => {
    if (text.trim() == "") {
      this.setState({
        Items: tempAllItems,
      });
    } else {
      this.setState({
        Items: text.trim().toLowerCase() ? tempAllItems.filter(
          i => i.Skills.toLowerCase().indexOf(text.trim().toLowerCase()) > -1
            || i.Name.toLowerCase().indexOf(text.trim().toLowerCase()) > -1
            || i.Geography.toLowerCase().indexOf(text.trim().toLowerCase()) > -1
            || i.SystemName.toLowerCase().indexOf(text.trim().toLowerCase()) > -1
            || i.Experience.toString().indexOf(text.trim().toLowerCase()) > -1
            || i.Sector.toLowerCase().indexOf(text.trim().toLowerCase()) > -1
        ) : tempAllItems,
      });
    }
  }
}
