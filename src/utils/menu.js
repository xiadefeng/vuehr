/**
 * 菜单请求工具类
 */
import {getRequest} from "./api";

/**
 * 初始化菜单
 * @param router
 * @param store
 */
export const initMenu = (router, store) => {
    // 判断 vuex 中的 state 是否存在菜单数据
    if (store.state.routes.length > 0) {
        return; // 如果存在直接 return
    }
    // 请求初始化菜单接口
    getRequest("/sys/menu").then(data => {
        if (data) {
            let fmtRoutes = formatRoutes(data);
            router.addRoutes(fmtRoutes);
            // 向 vuex 中的 state 添加格式化后的菜单数据
            store.commit('initRoutes',fmtRoutes);
            store.dispatch('connect');
        }
    });
};

/**
 * 格式化菜单数据
 * @param routes
 * @returns {[]}
 */
export const formatRoutes = (routes) => {
    let fmRoutes = [];  // 存储返回格式化后的数据
    // 此处遍历后端接口传来的菜单 json 数据
    routes.forEach(router => {
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        } = router;

        //  判断是否是一级菜单 一级菜单特点（存在 children 并且 childred 是一个数组）
        if (children && children instanceof Array) {
            // 递归调用 重写处理格式化的数据
            children = formatRoutes(children);
        }

        let fmRouter = {
            path: path,
            name: name,
            iconCls: iconCls,
            meta: meta,
            children: children,
            // 动态加载 component 组件
            component(resolve) {
                // 判断不同的组件寻找不同的路径
                if (component.startsWith("Home")) {
                    require(['../views/' + component + '.vue'], resolve);
                }
                if (component.startsWith("Emp")) {
                    require(['../views/emp/' + component + '.vue'], resolve);
                }
                if (component.startsWith("Per")) {
                    require(['../views/per/' + component + '.vue'], resolve);
                }
                if (component.startsWith("Sal")) {
                    require(['../views/sal/' + component + '.vue'], resolve);
                }
                if (component.startsWith("Sta")) {
                    require(['../views/sta/' + component + '.vue'], resolve);
                }
                if (component.startsWith("Sys")) {
                    require(['../views/sys/' + component + '.vue'], resolve);
                }
            }
        };
        // 向数组中添加格式化后的组件并返回
        fmRoutes.push(fmRouter);
    });
    return fmRoutes;
};