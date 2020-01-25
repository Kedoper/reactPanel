import React from "react";
import Home from "./Home";

class PageHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const handler = (page) => {
            switch (page) {
                case 'home':
                    return <Home/>;
                default:
                    return null;
            }
        };
        return handler(this.props.page)
    }
}

export default PageHandler;