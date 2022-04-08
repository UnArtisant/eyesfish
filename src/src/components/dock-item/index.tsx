import React from 'react';
import "./style.css"

interface DockItemProps {
    children : number
}

function Index({children} : DockItemProps) {
    return (
        <div className="dock-items">
            {children}
        </div>
    );
}

export default Index;