import React, { Component } from 'react';
import { Breadcrumb } from 'antd';

export default class Breadcrumbs extends Component {
    render() {
        const { list } = this.props;
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
}