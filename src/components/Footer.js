import React, { Component } from 'react';

export default function Footer() {
    return (
        <div className="footerDiv">
            <div className="footer w1200">
                <div className="fooL fl">
                    <div></div>
                    <p>Copyright C 2018 bttmall</p>
                </div>
                <div className="fooR fr">
                    <ul>
                        <li>
                            <h2>服务</h2>
                            <a href={window.BT_URL}>交易中心</a>
                            <a href={window.BT_URL}>帮助中心</a>
                            <a href={window.BT_URL}>提交请求</a>
                        </li>
                        <li>
                            <h2>条款说明</h2>
                            <a href={window.BT_URL + '/single/single_privacy'}>隐私政策</a>
                            <a href={window.BT_URL + '/single/single_terms'}>用户协议</a>
                            <a href={window.BT_URL + '/single/single_fees'}>手续费</a>
                        </li>
                        <li>
                            <h2>关于我们</h2>
                            <span>商务合作:admin@bttmall.com</span>
                            <span>客户支持合作:admin@bttmall.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-tip">© 2017-2018 BttMall, All Rights Reserved. BttMall Technology Co.,Limited</div>
        </div>
    )
}