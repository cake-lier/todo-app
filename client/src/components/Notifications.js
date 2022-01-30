import { Component } from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from "primereact/button";
import {DataScroller} from "primereact/datascroller";

class Notifications extends Component {

    constructor(props) {
        super(props);
    }

    itemTemplate(data) {
        return (
            <div>
                { data.text }
            </div>
        );
    }

    render() {
        return (
            <>
                <OverlayPanel ref={ e => this.notificationsPanel = e } dismissable>
                    <DataScroller
                        value={ this.props.notifications }
                        itemTemplate={ this.itemTemplate }
                        rows={ 5 }
                        inline
                        scrollHeight="500px"
                    />
                </OverlayPanel>
                <Button
                    icon="pi pi-bell"
                    className="p-button-lg p-button-rounded p-button-text p-button-plain"
                    onClick={ e => this.notificationsPanel.toggle(e) }
                />
            </>
        );
    }
}

export default Notifications;
