import React, { Component } from 'react';
import { Modal } from 'antd';

export default class DaySaleModal extends Component {
    render() {
        const { modal_show, hiddenModal, day_sale_list, symbol, currentTime } = this.props;
        return (
            <Modal
                title={null}
                visible={modal_show}
                footer={null}
                width={722}
                style={{'top': 200}}
                onCancel={hiddenModal}
            >
                <div className="day-sale-modal">
                    <div className="day-sale-modal-title">
                        <h3>今日<span>{symbol}</span>购物挖矿时间</h3>
                        <p>({currentTime.substring(0, 10)})</p>
                    </div>
                    <div className="day-sale-modal-main">
                        <div className="day-sale-modal-main-title">
                            <span>时间</span>
                            <span>总额度</span>
                            <span>剩余额度</span>
                            <span>进度</span>
                        </div>
                        {
                            day_sale_list.length !== 0 ? (
                                <ul>
                                    {
                                        day_sale_list.map((item, index) => {
                                            const { releaseTime, releaseAccount, surplusAccount, miningRete, doing } = item;
                                            return (
                                                <li key={index} className={index % 2 === 0 ? 'bg-gray' : ''}>
                                                    <span>{releaseTime + ':00:00'}</span>
                                                    <span className={doing ? 'font-green' : ''}>{releaseAccount}</span>
                                                    <span className={doing ? 'font-red' : ''}>{surplusAccount}</span>
                                                    <span className={doing ? 'font-red' : ''}>{miningRete * 100 + '%'}</span>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            ) : null
                        }
                    </div>
                </div>
            </Modal>
        )
    }
}