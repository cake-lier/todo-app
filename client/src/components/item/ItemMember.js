import React from 'react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Image } from 'primereact/image';

export function ItemMember({user}){
    return (
        // <Button
        //         className="p-button-rounded"
        //         tooltip="Click to proceed" />
        <Image src={user.profilePicturePath} alt="Image Text" />
    )
}