import React from 'react';
import { Link }  from 'react-router-dom';
import { Breadcrumb } from 'antd';

export default function Breadcrumbs(props) {
    const { list } = props;
    return (
        <Breadcrumb style={{'fontSize': '12px', 'lineHeight': '25px'}}>
            {
                list.map((item, index) => {
                    return (
                        item.is_line ? (
                            <Breadcrumb.Item key={index}><Link to={item.line}>{item.name}</Link></Breadcrumb.Item>
                        ) : (
                            <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
                        )
                    )
                })
            }
        </Breadcrumb>
    )
}