import { Menu } from 'primereact/menu';
import { PrimeIcons } from 'primereact/api';
import React, { Component } from 'react';
import "../pages/userhome/UserHome.css"

export class MainMenu extends Component {
    constructor(props) {
        super(props);
        // this.state TODO

        this.mainItems = [
            {label: 'My day', icon: PrimeIcons.CHECK_SQUARE},
            {label: 'My lists', icon: PrimeIcons.LIST},
            {label: 'Shared with me', icon: PrimeIcons.USERS},
            {label: 'Calendar', icon: PrimeIcons.CALENDAR},
            {label: 'Reports', icon: PrimeIcons.CHART_BAR},
            {label: 'Achievement', icon: PrimeIcons.STAR}
        ];
        this.subItems = [
            {label: 'Search', icon: PrimeIcons.SEARCH},
            {label: 'Settings', icon: PrimeIcons.COG}
        ];
    }


    render() {
        return (
            <div className="grid h-full" style={{border: '1px solid #e5e5e5'}}>
                    <div className="grid">
                        <div className="col-12 no-padding">
                            <Menu model={this.mainItems} style={{borderTop: 0, borderBottom:0, padding:0}}/>
                        </div>
                    </div>
                    <div className="grid align-content-end">
                        <div className="col-12 no-padding">
                            <Menu model={this.subItems} style={{borderTop: 0, borderBottom:0, padding:0}}/>
                        </div>
                    </div>
            </div>
        )
    }
}