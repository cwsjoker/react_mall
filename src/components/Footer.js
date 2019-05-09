import React from 'react';

export default function Footer() {
    return (
        <div className="footerDiv">
            <div className="footer w1200">
                <div className="fooL fl">
                    <div></div>
                    <p>Copyright C 2019 bttmall</p>
                </div>
                <div className="fooR fr">
                    <ul>
                        <li>
                            <h2>服务</h2>
                            <a href={window.BT_URL + '/market?symbol=BT_USDT'}>币币交易</a>
                            <a href={window.BT_URL + '/ex/member/account/withdraw'}>提现</a>
                            <a href={window.BT_URL + '/ex/member/account/deposit'}>充值</a>
                        </li>
                        <li>
                            <h2>条款说明</h2>
                            <a href={window.BT_URL + '/privacys'}>隐私政策</a>
                            <a href={window.BT_URL + '/agreement'}>用户协议</a>
                            <a href={window.BT_URL + '/handlingfee'}>手续费</a>
                        </li>
                        <li>
                            <h2>关于我们</h2>
                            <span>商务合作:admin@bttmall.com</span>
                            <span>客户支持合作:support@bttmall.com</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-tip">© 2017-2019 BttMall, All Rights Reserved. BttMall Technology Co.,Limited</div>
        </div>
    )
}