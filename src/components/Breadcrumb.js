import React from 'react';
import { Breadcrumb } from 'antd';

export default function Breadcrumbs(props) {
    const { list } = props;
    return (
        <Breadcrumb>
            {
                list.map((item, index) => {
                    return (
                        item.is_line ? (
                            <Breadcrumb.Item key={index}><a href={item.line}>{item.name}</a></Breadcrumb.Item>
                        ) : (
                            <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
                        )
                    )
                })
            }
        </Breadcrumb>
    )
}