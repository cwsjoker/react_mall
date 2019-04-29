import React from 'react';
import '../assets/style/maskbox.scss';

export default function MaskBox(props) {
    const { show } = props;
    
    return (
        show ? (
            <div className="mask-box"></div>
        ) : null
    )
}