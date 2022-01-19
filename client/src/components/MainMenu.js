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
            <div className="grid h-full" style={{border: '1px solid #e5e5e5'}}>
                    <div className="grid">
                        <div className="col-12 p-0">
                            <Menu className="border-y-none p-0" model={ this.mainItems } />
                        </div>
                    </div>
                    <div className="grid align-content-end">
                        <div className="col-12 p-0">
                            <Menu className="border-y-none p-0" model={ this.subItems } />
                        </div>
                    </div>
            </div>
        )
    }
}
