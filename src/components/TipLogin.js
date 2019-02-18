import React from 'react';
import '../assets/style/tiplogin.scss';

export default function TipLogin() {
    return (
        <div className="tipLogin-page">
            <div className="tipLogin-page-main">
                <div>您还未登录<a href={window.BT_URL + 'login?redirectUrl=shop'}>去登录</a></div>
            </div>
        </div>
    )
}