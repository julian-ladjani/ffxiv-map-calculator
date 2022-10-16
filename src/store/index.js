import {createStore} from 'vuex'
import {useTheme} from 'vuetify'
import VuexPersist from "vuex-persist";
import Item from "../models/Item.js"
import Map from "../models/Map.js"
import User from "../models/User.js"
import axios from 'axios'
import pkg from '../../package.json'

const vuexPersist = new VuexPersist({
    key: "ffxiv-map-calculator",
    storage: window.localStorage
});

export default createStore({
    state() {
        return {
            maps: [],
            items: [],
            users: [],
            theme: window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light",
            settings: {
                language: "fr",
                searchType: "prefix",
                payTaxIfItemGainIsNotEnough: true,
                tax: 10,
                precision: 0,
                buyPricePercent: 80
            }
        }
    },
    getters: {
        getMap: (state) => (id) => {
            return state.maps.find(map => map.id === id)
        },
        getItem: (state) => (id) => {
            return state.items.find(item => item.id === id)
        },
        getUser: (state) => (id) => {
            return state.users.find(user => user.id === id)
        },
        getMaps(state) {
            return state.maps
        },
        getItems(state) {
            return state.items
        },
        getUsers(state) {
            return state.users
        },
        // Calculation
        getPrecision(state) {
            return state.settings.precision
        },
        getItemBuyPrice: (state, getters) => (id) => {
            let item = state.items.find(item => item.id === id)
            if (item === undefined)
                return 0
            return parseFloat(((item.price / 100) * state.settings.buyPricePercent).toFixed(getters.getPrecision))
        },
        getTotalItemGain(state, getters) {
            let totalGain = 0
            state.maps.forEach(map => {
                if (map.includeInCalculation)
                    totalGain += getters.getTotalMapItemGain(map.id)
            })
            return totalGain
        },
        getTotalGain(state, getters) {
            let totalGain = 0
            state.maps.forEach(map => {
                if (map.includeInCalculation)
                    totalGain += getters.getTotalMapGain(map.id)
            })
            return totalGain
        },
        getTotalMapItemGain: (state) => (id) => {
            let map = state.maps.find(map => map.id === id)
            if (map === undefined)
                return 0
            let items = state.items
            let totalGain = 0
            map.items.forEach(mapItem => {
                let item = items.find(fItem => fItem.id === mapItem.id)
                if (item !== undefined) {
                    totalGain += (item.price * mapItem.count)
                }
            })
            return totalGain
        },
        getTotalMapGain: (state, getters) => (id) => {
            let map = state.maps.find(map => map.id === id)
            if (map === undefined)
                return 0
            return getters.getTotalMapItemGain(id) + (map.singleUserProfit * map.users.length)
        },
        getTotalMapItemGainPerUser: (state, getters) => (id) => {
            let map = state.maps.find(map => map.id === id)
            if (map === undefined || map.users.length <= 0)
                return 0
            return parseFloat((getters.getTotalMapItemGain(id) / map.users.length).toFixed(getters.getPrecision))
        },
        getTotalMapGainPerUser: (state, getters) => (id) => {
            let map = state.maps.find(map => map.id === id)
            if (map === undefined || map.users.length <= 0)
                return 0
            return getters.getTotalMapItemGainPerUser(id) + map.singleUserProfit
        },
        getTotalUserGain: (state, getters) => (id) => {
            let maps = state.maps.filter(map => map.users.some(user => user === id))
            if (maps.length <= 0)
                return 0
            let totalGain = 0
            maps.forEach(map => {
                if (map.includeInCalculation)
                    totalGain += getters.getTotalMapGainPerUser(map.id)
            })
            return totalGain
        },
        getTotalUserItemGain: (state, getters) => (id) => {
            let maps = state.maps.filter(map => map.users.some(user => user === id))
            if (maps.length <= 0)
                return 0
            let totalGain = 0
            maps.forEach(map => {
                if (map.includeInCalculation)
                    totalGain += getters.getTotalMapItemGainPerUser(map.id)
            })
            return totalGain
        },
        getUserGainWithMap: (state, getters) => (data) => {
            let map = state.maps.find(map => map.id === data.mapId && map.users.some(user => user === data.userId))
            if (map === undefined)
                return 0
            return getters.getTotalMapGainPerUser(map.id)
        },
        getUserItemGainWithMap: (state, getters) => (data) => {
            let map = state.maps.find(map => map.id === data.mapId && map.users.some(user => user === data.userId))
            if (map === undefined)
                return 0
            return getters.getTotalMapItemGainPerUser(map.id)
        },
        getTaxesFromGain: (state, getters) => (gain) => {
            let taxPercent = state.settings.tax
            return parseFloat(((gain * taxPercent) / 100).toFixed(getters.getPrecision))
        },
        getGainAfterTaxes: (state, getters) => (gain) => {
            let tax = getters.getTaxesFromGain(gain)
            return gain - tax
        },
        getGainJson(state, getters) {
            let mapSet = {}
            let userSet = {}
            let totalItemGain = getters.getTotalItemGain
            let totalGain = getters.getTotalGain
            let totalTax = getters.getTaxesFromGain(totalGain)
            state.maps.forEach(map => {
                let totalMapItemGain = getters.getTotalMapItemGain(map.id)
                let totalMapGain = getters.getTotalMapGain(map.id)
                let totalMapTax = getters.getTaxesFromGain(totalMapGain)
                let totalMapItemGainPerUser = getters.getTotalMapItemGainPerUser(map.id)
                let totalMapGainPerUser = getters.getTotalMapGainPerUser(map.id)
                let totalMapTaxPerUser = getters.getTaxesFromGain(totalMapGainPerUser)
                mapSet[map.id] = {
                    id: map.id,
                    name: map.name,
                    includeInCalculation: map.includeInCalculation,
                    users: state.users.filter(user => map.users.some(mapUser => mapUser === user.id)),
                    owner: state.users.find(user => map.owner === user.id),
                    nbPlayer: map.users.length,
                    nbItems: map.items.map(item => item.count).reduce(function add(accumulator, a) {return accumulator + a;}, 0),
                    totalItemGain: totalMapItemGain,
                    totalGilsGain: totalMapGain - totalMapItemGain,
                    totalGain: totalMapGain,
                    totalTax: totalMapTax,
                    needToGive: parseFloat((state.settings.payTaxIfItemGainIsNotEnough ? totalMapItemGain - totalMapTax : Math.max(0, totalMapItemGain - totalMapTax)).toFixed(getters.getPrecision)),
                    itemGainPerUser: totalMapItemGainPerUser,
                    gilsGainPerUser: map.singleUserProfit,
                    totalGainPerUser: totalMapGainPerUser,
                    totalTaxPerUser: totalMapTaxPerUser,
                    needToGivePerUser: parseFloat((state.settings.payTaxIfItemGainIsNotEnough ? totalMapItemGainPerUser - totalMapTaxPerUser : Math.max(0, totalMapItemGainPerUser - totalMapTaxPerUser)).toFixed(getters.getPrecision)),
                }
            })
            state.users.forEach(user => {
                let totalUserItemGain = getters.getTotalUserItemGain(user.id)
                let totalUserGain = getters.getTotalUserGain(user.id)
                let userMapSet = {}
                let totalUserTax = getters.getTaxesFromGain(totalUserItemGain + (totalUserGain - totalUserItemGain))
                state.maps.filter(map => map.users.some(mapUser => mapUser === user.id)).forEach(userMap =>{
                    let totalUserMapItemGain = getters.getUserItemGainWithMap({userId: user.id, mapId: userMap.id})
                    let totalUserMapGain = getters.getUserGainWithMap({userId: user.id, mapId: userMap.id})
                    let totalUserMapTax = getters.getTaxesFromGain(totalUserMapGain)
                    userMapSet[userMap.id] = {
                        id: userMap.id,
                        name: userMap.name,
                        includeInCalculation: userMap.includeInCalculation,
                        owner: state.users.find(user => userMap.owner === user.id),
                        totalItemGain: totalUserMapItemGain,
                        totalGilsGain: userMap.singleUserProfit,
                        totalGain: totalUserMapGain,
                        totalTax: totalUserMapTax,
                        needToGive: parseFloat((state.settings.payTaxIfItemGainIsNotEnough ? totalUserMapItemGain - totalUserMapTax : Math.max(0, totalUserMapItemGain - totalUserMapTax)).toFixed(getters.getPrecision)),
                    }
                })
                userSet[user.id] = {
                    id: user.id,
                    name: user.name,
                    totalItemGain: totalUserItemGain,
                    totalGilsGain: totalUserGain - totalUserItemGain,
                    totalGain: totalUserGain,
                    totalTax: totalUserTax,
                    needToGive: parseFloat((state.settings.payTaxIfItemGainIsNotEnough ? totalUserItemGain - totalUserTax : Math.max(0, totalUserItemGain - totalUserTax)).toFixed(getters.getPrecision)),
                    maps: userMapSet
                }
            })
            return {
                maps: mapSet,
                users: userSet,
                totalItemGain: totalItemGain,
                totalGilsGain: totalGain - totalItemGain,
                totalGain: totalGain,
                totalTax: totalTax,
                needToGive: parseFloat((state.settings.payTaxIfItemGainIsNotEnough ? totalItemGain - totalTax : Math.max(0, totalItemGain - totalTax)).toFixed(getters.getPrecision))
            }
        },
    },
    mutations: {
        ADD_ITEM(state, data) {
            if (!state.items.some(item => item.id === data.id)) {
                state.items.push(data)
            } else {
                let item = state.items.find(item => item.id === data.id)
                let idx = state.items.findIndex(item => item.id === data.id)
                item.name = data.name
                state.items[idx] = item
            }
        },
        SET_ITEM_PRICE(state, data) {
            if (!state.items.some(item => item.id === data.id)) {
                return
            }
            let item = state.items.find(item => item.id === data.id)
            let idx = state.items.findIndex(item => item.id === data.id)
            if (isNaN(data.price))
                item.price = 0
            else
                item.price = data.price
            state.items[idx] = item
        },
        SET_USER(state, data) {
            if (data.id.length === 0 || !state.users.some(user => user.id === data.id)) {
                state.users.push(new User(data.name))
            } else {
                let user = state.users.find(user => user.id === data.id)
                let idx = state.users.findIndex(user => user.id === data.id)
                user.name = data.name
                state.users[idx] = user
            }
        },
        SET_MAP(state, data) {
            let idx = state.maps.findIndex(map => map.id === data.id)
            if (idx !== -1)
                state.maps[idx] = data
            else
                state.maps.push(data)
        },
        REMOVE_USER(state, data) {
            this.commit("REMOVE_MAP_USER", data)
            state.users = state.users.filter(user => user.id !== data)
        },
        REMOVE_ITEM(state, data) {
            this.commit("REMOVE_MAP_ITEM", data)
            state.items = state.items.filter(item => item.id !== data)
        },
        REMOVE_MAP(state, data) {
            state.maps = state.maps.filter(map => map.id !== data)
        },
        REMOVE_MAP_USER(state, data) {
            state.maps = state.maps.map(map => {
                map.users = map.users.filter(user => user !== data)
                return map
            })
        },
        REMOVE_MAP_ITEM(state, data) {
            state.maps = state.maps.map(map => {
                map.items = map.items.filter(item => item.id !== data)
                return map
            })
        },
        SET_THEME(state, data) {
            state.theme = data
        },
        SET_LANGUAGE(state, data) {
            state.settings.language = data
        },
        SET_SEARCH_TYPE(state, data) {
            state.settings.searchType = data
        },
        SET_TAX(state, data) {
            state.settings.tax = data
        },
        SET_BUY_PRICE_PERCENT_CHANGED(state, data) {
            state.settings.buyPricePercent = data
        },
        SET_PRECISION(state, data) {
            state.settings.precision = data
        },
        SET_PAY_TAX_IF_ITEM_GAIN_IS_NOT_ENOUGH(state, data) {
            state.settings.payTaxIfItemGainIsNotEnough = data
        },
    },
    actions: {
        async searchItem(context, query) {
            let data = await axios.get("https://xivapi.com/search?string=" + query + "&string_algo=" + context.state.settings.searchType + "&language=fr&indexes=item")
            return data.data.Results.map(item => new Item(
                item.ID,
                item.Name,
                "https://xivapi.com" + item.Url,
                "https://xivapi.com" + item.Icon)
            )
        },
        async getNewVersion(context) {
            let result = await axios.get("https://api.github.com/repos/julian-ladjani/ffxiv-map-calculator/releases")
            return result?.data?.find(version => version?.draft === false && version?.prerelease === false) ?? null
        },
        getCurrentVersion(context) {
            return pkg.version
        },
        async getVersion(context) {
            return {
                currentVersion: await context.dispatch('getCurrentVersion'),
                newVersion: await context.dispatch('getNewVersion'),
            }
        },
        openUrl(context, payload) {
            let url = payload.url !== undefined ? payload.url : payload
            let close = payload.close !== undefined ? payload.close : false
            if (typeof nw !== "undefined") {
                nw.Shell.openExternal(url)
                if (close)
                    window.close()
            }
            else
                window.open(url ?? payload)
        },
        setUser(context, payload) {
            context.commit("SET_USER", payload);
        },
        removeUser(context, id) {
            context.commit("REMOVE_USER", id);
        },
        addItem(context, item) {
            context.commit("ADD_ITEM", item);
        },
        setItemPrice(context, payload) {
            context.commit("SET_ITEM_PRICE", payload);
        },
        setMap(context, map) {
            context.commit("SET_MAP", map);
        },
        removeMap(context, id) {
            context.commit("REMOVE_MAP", id);
        },
        removeItem(context, id) {
            context.commit("REMOVE_ITEM", id);
        },
        setTheme(context, theme) {
            context.commit("SET_THEME", theme);
        },
        setLanguage(context, language) {
            context.commit("SET_LANGUAGE", language)
        },
        setSearchType(context, searchType) {
            context.commit("SET_SEARCH_TYPE", searchType)
        },
        setTax(context, tax) {
            context.commit("SET_TAX", tax)
        },
        setBuyPricePercentChanged(context, percent) {
            context.commit("SET_BUY_PRICE_PERCENT_CHANGED", percent)
        },
        setPrecision(context, precision) {
            context.commit("SET_PRECISION", precision)
        },
        setPayTaxIfItemGainIsNotEnough(context, value) {
            context.commit("SET_PAY_TAX_IF_ITEM_GAIN_IS_NOT_ENOUGH", value)
        },
    },
    plugins: [vuexPersist.plugin],
    modules: {}
})
