import React from "react";
import {connect} from "react-redux";
import {Layout} from "antd";

const {Header, Content} = Layout;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Layout>
                <Header style={{backgroundColor: "#fff"}}>
                    <h1>Главная страница</h1>
                </Header>
                <Content style={{padding: 20, position: 'relative'}}>
                    dfd
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

export default connect(toProps)(Home);