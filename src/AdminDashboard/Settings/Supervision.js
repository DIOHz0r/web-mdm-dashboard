import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentPane from '../../Utils/ContentPane'
import ConstructInputs from '../../Utils/Forms'
import supervisionData from '../data/supervision.json'
import validateData from '../../Utils/validateData'
import { supervisionScheme } from '../../Utils/Forms/Schemes'

export default class Supervision extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buttonSaveClassName: "win-button win-button-primary hidden",
            name: validateData(supervisionData["Supervision.name"]),
            phone: validateData(supervisionData["Supervision.phone"]),
            website: validateData(supervisionData["Supervision.website"]),
            email: validateData(supervisionData["Supervision.email"]),
            address: validateData(supervisionData["Supervision.address"])
        }
    }

    saveChanges = () => {
        this.setState({
            buttonSaveClassName: "win-button win-button-primary hidden"
        })
    }

    changeState = (name, value) => {
        this.setState({
            [name]: value
        })
        if (this.state.buttonSaveClassName === "win-button win-button-primary hidden") {
            this.setState({
                buttonSaveClassName: "win-button win-button-primary"
            })
        }
    }

    render() {

        const supervision = supervisionScheme({
            state: this.state,
            changeState: this.changeState
        })

        return (
            <ContentPane itemListPaneWidth={this.props.itemListPaneWidth}>
            <div className="list-content Profiles">

                <ConstructInputs data={supervision.helpDeskInformation} icon="supervisionIcon" title="Helpdesk Information" />
                <button className={this.state.buttonSaveClassName} style={{ margin: "20px", float: "right" }} onClick={this.saveChanges}>
                    Save
                </button>
                <br />
            </div>
            </ContentPane>
        )
    }
}

Supervision.propTypes = {
    itemListPaneWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
}