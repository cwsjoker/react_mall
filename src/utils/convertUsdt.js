import $home_api from '../fetch/api/home';


const changeUsdt = async (list) => {
    list.forEach(v => {
        v.change_price_usdt = 0;
    });
    const res = await $home_api.getAllUSDT();
    if (res) {
        const usdt_change_obj = res.data.data;
        const re_list = list.map(v => {
            v.change_price_usdt = (v.price * usdt_change_obj[v.symbol]).toFixed(2);
            return v;
        })
        return re_list;
    } else {
        return list;
    }
}

export default changeUsdt;

