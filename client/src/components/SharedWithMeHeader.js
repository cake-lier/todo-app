import { Button } from 'primereact/button';

function SharedWithMeHeader() {
    return (
        <div className="grid">
            <div className="col-12 m-0 pl-1 flex align-content-center justify-content-end">
                <Button className="py-0" id="search-button" icon="pi pi-search" alt="search"/>
            </div>
        </div>
    );
}

export default SharedWithMeHeader;
