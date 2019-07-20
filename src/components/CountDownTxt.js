import React, { Component }  from 'react';

const CountDownTxt = class CountDownTxt extends Component {
    constructor() {
        super()
        this.state = {
            diff_count: 0
        }
    }
    componentDidMount() {
        this.setState({
            diff_count: this.props.discount
        }, () => {
            this.timerID = setInterval(() => {
                if (this.state.diff_count === 0) {
                    clearInterval(this.timerID);
                    return;
                }
                this.setState((prevState) => ({
                    diff_count: prevState.diff_count - 1
                }))
            }, 1000)
        })
    }
    render() {
        const { diff_count } = this.state;
        return (
            <span>
                <span>{Math.floor(diff_count / (3600 * 24)) < 10 ? '0' + Math.floor(diff_count / (3600 * 24)) : Math.floor(diff_count / (3600 * 24))}</span>天
                <span>{Math.floor(diff_count / 3600 % 24) < 10 ? '0' + Math.floor(diff_count / 3600 % 24) : Math.floor(diff_count / 3600 % 24)}</span>时
                <span>{Math.floor((diff_count / 60 % 60)) < 10 ? '0' + Math.floor((diff_count / 60 % 60)) : Math.floor((diff_count / 60 % 60))}</span>分
                <span>{Math.floor((diff_count % 60)) < 10 ? '0' + Math.floor((diff_count % 60)) : Math.floor((diff_count % 60))}</span>秒
            </span>
        )
    }
}

export default CountDownTxt;