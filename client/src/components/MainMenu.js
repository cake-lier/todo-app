import { Menu } from 'primereact/menu';
import { PrimeIcons } from 'primereact/api';
import React, { Component } from 'react';

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
            <div className="grid h-screen">
                <div className="grid align-content-start">
                    <Menu model={this.mainItems} style={{border: 0}}/>
                </div>
                <div className="grid align-content-end">
                    <Menu model={this.subItems} style={{border: 0}}/>
                </div>
            </div>
        )
    }
}