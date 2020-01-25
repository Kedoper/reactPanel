import React from "react";
import {Avatar, Button, Card, Icon, Layout, Menu, Result, Spin} from "antd";
import {connect} from "react-redux";
import PageHandler from "./AppPages/PageHandler";

const {Sider, Content, Footer, Header} = Layout;
const {Meta} = Card;

function sendRequest(method = "GET", url, data = {}) {
    return new Promise((resolve, reject) => {
        let xr = new XMLHttpRequest(),
            body = JSON.stringify(data);
        xr.withCredentials = true;
        xr.open(method, url);
        xr.send(body);
        xr.onreadystatechange = function () {
            if (xr.readyState === 4 && xr.status === 200) {
                try {
                    resolve(JSON.parse(xr.response));
                } catch (e) {
                    reject()
                }
            } else if (xr.status !== 200) {
                reject()
            }
        }
    });
}

class TestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarCollapsed: false,
            currentPage: '',
            loadPage: false,
            loadPageError: false,
            loadPageErrorMessage: null,
            pagesMap: {
                1: 'home',
                2: 'users',
                3: 'reports',
                4: 'files',
            },
        }
    }

    onCollapse = collapsed => {
        this.setState({sidebarCollapsed: collapsed})
    };
    pageLoad = (page) => {
        sendRequest('POST', 'http://127.0.0.1:8011/access',
            {user_id: this.props.state.user.user_id, page: page}).then(value => {
            if (value.code === 0) {
                this.setState({
                    loadPage: false,
                    currentPage: page,
                    loadPageError: false,
                    loadPageErrorMessage: null
                })
            } else {
                this.setState({
                    loadPage: false,
                    loadPageError: true,
                    loadPageErrorMessage: 'У вас нет доступа к данной странице.'
                })
            }
        }).catch(() => {
            this.setState({
                loadPage: false,
                loadPageError: true,
                loadPageErrorMessage: null
            })
        })
    };
    menuSelect = e => {
        this.setState({loadPage: true});
        let page = this.state.pagesMap[e.key];
        this.pageLoad(page);

    };

    componentDidMount() {
        this.pageLoad('home');
    }

    render() {
        const errorLoadPage = <Result status={this.state.loadPageErrorMessage ? 'error' : 'warning'}
                                      title={this.state.loadPageErrorMessage ?
                                          this.state.loadPageErrorMessage :
                                          'При загрузке данных с сервера возникла ошибка, повторите позже.'}
                                      extra={
                                          <Button type={'primary'} onClick={() => window.location.reload()}>
                                              Обновить страницу
                                          </Button>
                                      }
        />;
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider theme={'light'} collapsible collapsed={this.state.sidebarCollapsed}
                       onCollapse={this.onCollapse} className={"sideBarPages"}>
                    <div className="logo" style={{height: 90}}/>
                    <Menu defaultSelectedKeys={['1']} mode={'inline'} onSelect={this.menuSelect}>
                        <Menu.Item key={1}>
                            <Icon type={'desktop'}/>
                            <span>Главная</span>
                        </Menu.Item>
                        <Menu.Item key={2}>
                            <Icon type={'user'}/>
                            <span>Пользователи</span>
                        </Menu.Item>
                        <Menu.Item key={3}>
                            <Icon type={'desktop'}/>
                            <span>Отчеты</span>
                        </Menu.Item>
                        <Menu.Item key={4}>
                            <Icon type={'desktop'}/>
                            <span>Файлы</span>
                        </Menu.Item>
                    </Menu>
                    <Menu mode={'inline'} selectable={false} style={{position: 'absolute', bottom: 0}}>
                        <Menu.Item onClick={() => window.location.reload()}>
                            <Icon type="logout"/>
                            <span>Выйти</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Content style={{position: 'relative'}}>
                    {this.state.loadPage ?
                        <Spin style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}
                              size={"large"} tip={'Идет загрузка...'}/> :
                        <>
                            {this.state.loadPageError ? errorLoadPage : <PageHandler page={this.state.currentPage}/>}
                        </>
                    }
                </Content>
            </Layout>
        )
    }
}

function toProps(state) {
    return {
        state
    }
}

export default connect(toProps)(TestPage);