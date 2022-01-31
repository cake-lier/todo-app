import { Button } from 'primereact/button';

function SharedWithMeHeader() {

    return (
        <div className="grid pb-5">
            <div className="col-12 m-0 pl-1 flex align-content-center justify-content-end">
                <Button className="p-2" id="search-button" icon="pi pi-search" alt="search"/>
            </div>
        </div>
    );
}

export default SharedWithMeHeader;