/*
*   Copyright © 2018 Teclib. All rights reserved.
*
*   This file is part of web-mdm-dashboard
*
* web-mdm-dashboard is a subproject of Flyve MDM. Flyve MDM is a mobile
* device management software.
*
* Flyve MDM is free software: you can redistribute it and/or
* modify it under the terms of the GNU General Public License
* as published by the Free Software Foundation; either version 3
* of the License, or (at your option) any later version.
*
* Flyve MDM is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* ------------------------------------------------------------------------------
* @author     Gianfranco Manganiello (gmanganiello@teclib.com)
* @author     Hector Rondon (hrondon@teclib.com)
* @copyright  Copyright © 2018 Teclib. All rights reserved.
* @license    GPLv3 https://www.gnu.org/licenses/gpl-3.0.html
* @link       https://github.com/flyve-mdm/web-mdm-dashboard
* @link       http://flyve.org/web-mdm-dashboard
* @link       https://flyve-mdm.com
* ------------------------------------------------------------------------------
*/

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { uiSetNotification } from '../../../../store/ui/actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
import Loading from '../../../../components/Loading'
import itemtype from '../../../../shared/itemtype'
import ContentPane from '../../../../components/ContentPane'

function mapDispatchToProps(dispatch) {
    const actions = {
        setNotification: bindActionCreators(uiSetNotification, dispatch)
    }
    return { actions }
}

class ChangeTokenLife extends PureComponent {

    constructor (props) {
        super (props)
        this.state = {
            tokenLife: this.props.tokenLife,
            isLoading: false
        }
    }

    changeState = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    saveTokenLife = () => {
        this.setState({
            isLoading: true
        }, async () => {
            try {
                await this.props.glpi.updateItem({
                    itemtype: itemtype.PluginFlyvemdmEntityconfig,
                    input: [{
                        id: this.props.entityID,
                        agent_token_life: `P${this.state.tokenLife}D`
                    }]
                })
                this.props.saveValues('tokenLife', this.state.tokenLife)
                this.props.changeMode('')
                this.props.actions.setNotification({
                    title: I18n.t('commons.success'),
                    body: I18n.t('notifications.token_life_changed'),
                    type: 'success'
                })
            } catch (error) {
                this.props.actions.setNotification(this.props.handleMessage({ type: 'alert', message: error }))
                this.setState({ isLoading: false })
            }
        })
    }

    render () {
        return this.state.isLoading ? <Loading message={`${I18n.t('commons.saving')}...`}/>: 
            ( 
                <ContentPane>
                    <div className="list-element">
                        {I18n.t('settings.entity.date_period')}
                        <div className="list-element__detail">
                            {I18n.t('settings.entity.number_of_days')}
                        </div>
                    </div>
                    <div className="list-element">
                        <input 
                            type="number" 
                            className="win-textbox" 
                            name="tokenLife"
                            value={this.state.tokenLife}
                            onChange={this.changeState}
                        />
                    </div>
                    <button className="btn btn--secondary" style={{marginRight: 10}} onClick={() => this.props.changeMode("")}>
                        {I18n.t('commons.cancel')}
                    </button>
                    <button className="btn btn--primary" onClick={this.saveTokenLife}>
                        {I18n.t('commons.save')}
                    </button>
                </ContentPane>
            )
    }
}

ChangeTokenLife.propTypes = {
    changeMode: PropTypes.func.isRequired,
    tokenLife: PropTypes.string.isRequired,
    saveValues: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    glpi: PropTypes.object.isRequired,
    entityID: PropTypes.string.isRequired
}

export default connect(null, mapDispatchToProps)(ChangeTokenLife)
