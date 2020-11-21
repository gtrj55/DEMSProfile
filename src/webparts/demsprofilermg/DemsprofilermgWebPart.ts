import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DemsprofilermgWebPartStrings';
import Demsprofilermg from './components/Demsprofilermg';
import { IDemsprofilermgProps } from './components/IDemsprofilermgProps';

export interface IDemsprofilermgWebPartProps {
  description: string;
  spSiteUrl : string;
}

export default class DemsprofilermgWebPart extends BaseClientSideWebPart<IDemsprofilermgWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDemsprofilermgProps> = React.createElement(
      Demsprofilermg,
      {
        description: this.properties.description,
        spSiteUrl:this.properties.spSiteUrl,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),

                PropertyPaneTextField('spSiteUrl', {
                  label: "SP Site URL"
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
