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
import SplitView from "../../components/SplitView"
import HeaderBreadcrumb from '../../components/HeaderBreadcrumb'
import getMode from '../../shared/getMode'
import configureDisplay from '../../shared/configureDisplay'
import setGlpiCookie from '../../shared/setGlpiCookie'
import animationsWinJs from '../../shared/animationsWinJs/index'
import glpi from '../../shared/glpiApi'
import { I18n } from "react-i18nify"
import Confirmation from '../../components/Confirmation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { logout } from '../../store/authentication/actions'

/** timeout to contract the lateral menu */
const TIMEOUT_CONTRACT = 150

function mapDispatchToProps(dispatch) {
    const actions = {
        logout: bindActionCreators(logout, dispatch)
    }
    return { actions }
}

/**
 * Wrapper component with the basic structure of the admin dashboard layout 
 * @param {component} WrappedComponent Component to wrap 
 * @return {component} The component with the admin dashboard layout
 */
const withAdminDashboardLayout = WrappedComponent => {
    class AdminDashboardLayout extends PureComponent {
        /** 
         * Create AdminDashboardLayout
         * @param {object} props
         */ 
        constructor(props) {
            super(props)
            this.state = {
                expanded: false,
                contract: false,
                mode: getMode(),
                iframe: undefined
            }

            window.addEventListener('resize', this.handleResize)
            configureDisplay()
            animationsWinJs()
        }

        /** Close current session */ 
        logout = async () => {
            const isOK = await Confirmation.isOK(this.contentDialog)
            if (isOK) {
                this.props.actions.logout(this.props.history)
            }
        }

        /** Change 'mode' according to the resolution of the screen */
        handleResize = () => {
            let prevMode = this.state.mode
            let nextMode = getMode()

            if (prevMode !== nextMode) {
                this.setState({ mode: nextMode })
            }
        }

        /** Configure 'baseURL' and the cookies of glpi */
        componentDidMount = async () => {
            const { cfg_glpi } = await glpi.getGlpiConfig()
            localStorage.setItem('baseURL', cfg_glpi.url_base)
            this.setState(
                { iframe: <iframe title="glpi-backend" src={`//${cfg_glpi.url_base.split("//")[1]}`} style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}></iframe> },
                () => setGlpiCookie(
                    this.setState({
                        iframe: undefined
                    })
                )
            )
        }

        /** Remove 'resize' event listener */
        componentWillUnmount() {
            window.removeEventListener('resize', this.handleResize)
        }

        /** Expand and collapse the side menu */
        handleToggleExpand = () => {
            this.state.expanded === false ? this.handleExpand() : this.handleContract()
        }

        /** Expand side menu */
        handleExpand = () => {
            this.setState({
                expanded: true,
                contract: false
            })
        }

        /** Collapse the side menu */
        handleContract = () => {
            this.setState({
                contract: true
            }, () => {
                this.handleSetTimeOut()
            })
        }

        /** Collapse the side menu after of the timeout */        
        handleSetTimeOut = () => {
            if (this.state.contract) {
                setTimeout(() => {
                    this.setState({
                        expanded: false,
                        contract: false
                    })
                }, TIMEOUT_CONTRACT)
            }
        }
        
        /** 
         * Render component 
         * @function render
         */ 
        render() {
            return (
                <main>

                    <HeaderBreadcrumb
                        handleToggleExpand={this.handleToggleExpand}
                        location={this.props.history.location}
                    />

                    {(this.state.iframe || '')}

                    <div className="flex-block">
                        <SplitView
                            expanded={this.state.expanded}
                            contract={this.state.contract}
                            handleExpand={this.handleExpand}
                            handleContract={this.handleContract}
                            handleSetTimeOut={this.handleSetTimeOut}
                            handleToggleExpand={this.handleToggleExpand}
                            mode={this.state.mode}
                            logout={this.logout}
                        />
                        <WrappedComponent {...this.props} mode={this.state.mode} />
                        <Confirmation
                            title={I18n.t('logout.close_session')}
                            message={I18n.t('settings.security.close_session_message')}
                            reference={el => this.contentDialog = el}
                        />
                    </div>

                </main>
            )
        }
    }

    return connect(
        null,
        mapDispatchToProps
    )(AdminDashboardLayout)
}

export default withAdminDashboardLayout