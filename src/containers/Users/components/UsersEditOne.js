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
import ConstructInputs from '../../../components/Forms'
import ContentPane from '../../../components/ContentPane'
import validateData from '../../../shared/validateData'
import IconItemList from '../../../components/IconItemList'
import { usersScheme } from '../../../components/Forms/Schemas'
import Loading from '../../../components/Loading'
import ErrorValidation from '../../../components/ErrorValidation'
import { I18n } from "react-i18nify"
import itemtype from '../../../shared/itemtype'
import getID from '../../../shared/getID'

export default class UsersEditOne extends PureComponent {
    
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            id: getID(this.props.history.location.pathname),
            login: undefined,
            firstName: undefined,
            realName: undefined,
            phone: undefined,
            mobilePhone: undefined,
            phone2: undefined,
            administrativeNumber: undefined,
            lastLogin: undefined,
            created: undefined,
            modified: undefined,
            emails: undefined,
            imageProfile: undefined,
            authentication: undefined,
            password: undefined,
            passwordConfirmation: undefined,
            category: undefined,
            defaultEntity: undefined,
            comments: undefined,
            typeImageProfile: undefined,
            title: undefined,
            location: undefined,
            defaultProfile: undefined,
            validSince: undefined,
            validUntil: undefined
        }
    }

    componentDidMount() {
        this.handleRefresh()
    }

    handleRefresh = () => {
        this.setState({
            isLoading: true
        }, async () => {
            try {
                const response = await this.props.glpi.getAnItem({ itemtype: itemtype.User, id: this.state.id})
                const myEmails = await this.props.glpi.getSubItems({
                    itemtype: itemtype.User, 
                    id: this.state.id, 
                    subItemtype: 'UserEmail'
                })
                const {cfg_glpi} = await this.props.glpi.getGlpiConfig()
        
                const parametersToEvaluate = {
                    minimunLength: cfg_glpi.password_min_length,
                    needDigit: cfg_glpi.password_need_number,
                    needLowercaseCharacter: cfg_glpi.password_need_letter,
                    needUppercaseCharacter: cfg_glpi.password_need_caps,
                    needSymbol: cfg_glpi.password_need_symbol
                }
                this.setState({
                    isLoading: false,
                    parametersToEvaluate,
                    login: validateData(response.name),
                    firstName: validateData(response.firstname),
                    realName: validateData(response.realname),
                    phone: validateData(response.phone),
                    mobilePhone: validateData(response.mobile),
                    phone2: validateData(response.phone2),
                    administrativeNumber: validateData(response.registration_number),
                    lastLogin: validateData(response.last_login),
                    created: validateData(response.date_creation),
                    modified: validateData(response.date_mod),
                    currentEmails: myEmails.map(a => ({...a})),
                    emails: validateData(myEmails, []),
                    imageProfile: validateData(response.picture, "profile.png"),
                    authentication: 'GLPI internal database',
                    password: '',
                    passwordConfirmation: '',
                    category: {
                        value: validateData(response.usercategories_id),
                        request: {
                            params: {itemtype: itemtype.UserCategory, options: {range: '0-200', forcedisplay: [2]}},
                            method: 'searchItems',
                            content: '1',
                            value: '2'
                        }
                    },
                    defaultEntity:  {
                        value: validateData(response.entities_id),
                        request: {
                            params: {},
                            method: 'getMyEntities',
                            content: 'name',
                            value: 'id'
                        }
                    },
                    comments: '',
                    typeImageProfile: 'file',
                    title: {
                        value: validateData(response.usertitles_id),
                        request: {
                            params: {itemtype: itemtype.UserTitle, options: {range: '0-200', forcedisplay: [2]}},
                            method: 'searchItems',
                            content: '1',
                            value: '2'
                        }
                    },
                    location: {
                        value: validateData(response.locations_id),
                        request: {
                            params: {itemtype: itemtype.Location, options: {range: '0-200', forcedisplay: [2]}},
                            method: 'searchItems',
                            content: '1',
                            value: '2'
                        }
                    },
                    defaultProfile: {
                        value: validateData(response.profiles_id),
                        request: {
                            params: {},
                            method: 'getMyProfiles',
                            content: 'name',
                            value: 'id'
                        }
                    },
                    validSince: response.begin_date ? new Date(response.begin_date) : undefined,
                    validUntil: response.end_date ? new Date(response.end_date) : undefined
                })
            } catch (error) {
                this.setState({isLoading: false})
            }
        })
    } 

    saveChanges = () => {
        let newUser = { 
            id: this.state.id,
            firstname: this.state.firstName,
            realname: this.state.realName,
            phone: this.state.phone,
            mobile: this.state.mobilePhone,
            phone2: this.state.phone2,
            registration_number: this.state.administrativeNumber,
            picture: this.state.imageProfile,
            usercategories_id: this.state.category.value,
            entities_id: this.state.defaultEntity.value,
            comment: this.state.comments,
            usertitles_id: this.state.title.value,
            locations_id: this.state.location.value,
            profiles_id: this.state.defaultProfile.value,
            begin_date: this.state.validSince,
            end_date: this.state.validUntil
        }

        let correctPassword = true        

        if (this.state.password !== '' || this.state.passwordConfirmation !== '') {
            if (!ErrorValidation.validation(this.state.parametersToEvaluate, this.state.password).isCorrect) {
                correctPassword = false
            } else if (!ErrorValidation.validation({...this.state.parametersToEvaluate, isEqualTo: {value: this.state.password, message: "Passwords do not match"}}, this.state.passwordConfirmation).isCorrect) {
                correctPassword = false
            } else {
                newUser = {
                    ...newUser,
                    password: this.state.password,
                    password2: this.state.passwordConfirmation,
                }
            }
        }
        
        if (correctPassword) { 
            this.setState (
                { isLoading: true },
                async () => {
                    try {
                        await this.props.glpi.updateItem({itemtype: itemtype.User, input: newUser})
                        await this.props.glpi.updateEmails({
                            userID: newUser.id, 
                            currentEmails: this.state.currentEmails, 
                            newEmails: this.state.emails
                        })
                        this.props.setNotification({
                            title: I18n.t('commons.success'),
                            body: I18n.t('notifications.saved_profile'),
                            type: 'success'
                        })
                        this.props.changeAction('reload')
                    } catch (error) {
                        this.props.setNotification(this.props.handleMessage({ type: 'alert', message: error }))
                        this.setState ({isLoading: false})
                    }
                }
            )
        }
    }


    changeState = (name, value) => {
        this.setState({
            [name]: value
        })
    }

    changeEmail = (index, value) => {
        let emails = [...this.state.emails]
        emails[index].email = value
        this.setState({emails})
    }

    changeSelect = (name, value) => {
        this.setState({
            [name]: {
                ...this.state[name],
                value
            }
        })
    }

    deleteEmail = (index) => {
        this.setState({
            emails: this.state.emails.slice(0,index).concat(this.state.emails.slice(index+1))
        })
    }

    addEmail = () => {
        this.setState({
            emails: [
                ...this.state.emails,
                { email: '' }
            ]
        })
    }

    previewFile = (evt) => {

        const file = evt.target.files[0]
        if (file.type.match('image.*')) {
            let reader = new FileReader()

            reader.onload = ((theFile) => {
                return (e) => {
                this.setState({
                    imageProfile: e.target.result,
                    typeImageProfile: 'file'
                })
            }})(file)

            reader.readAsDataURL(file)
        }
   }

    openFileChooser = () => {
        this.inputElement.value = null
        this.inputElement.click()
    }

    render () {

        let componetRender

        if (this.state.isLoading) {
            componetRender = <Loading message={`${I18n.t('commons.loading')}...`} />
        } else {
            const user = usersScheme({
                state: this.state, 
                changeState: this.changeState,
                changeEmail: this.changeEmail,
                deleteEmail: this.deleteEmail,
                changeSelect: this.changeSelect,
                glpi: this.props.glpi
            })

            const inputAttributes = {
                type: 'file',
                accept: "image/*",
                name: "imageProfile",
                style: { display: 'none' },
                ref: (element) => {
                    this.inputElement = element
                },
                onChange: this.previewFile
            }

            componetRender = (
                <div className="froms Profiles">

                    <div className="froms__row froms__row--icon">
                        <span className="viewIcon"/>
                    </div>
                    

                    <div className="froms__row">

                        <div style={{ overflow: 'hidden', paddingLeft: '20px'}}>
                            <input
                                {...inputAttributes}
                            />
                            <IconItemList 
                                image={this.state.imageProfile} 
                                type={this.state.typeImageProfile}
                                imgClick={this.openFileChooser}
                                size={150}
                                imgClass="clickable"
                            />
                        </div>

                    </div>


                    <ConstructInputs data={user.personalInformation} icon="contactIcon" />

                    <ConstructInputs data={user.passwordInformation} icon="permissionsIcon" />
                
                    <ConstructInputs data={user.validDatesInformation} icon="monthIcon" />

                    <ConstructInputs data={user.emailsInformation} icon="emailIcon" />
                    <div style={{ overflow: 'auto', paddingRight: '20px'}}>
                        <button className="win-button" style={{ float: 'right'}} onClick={this.addEmail}>
                            {I18n.t('commons.add_email')}
                        </button>
                    </div>

                    <ConstructInputs data={user.contactInformation} icon="phoneIcon" />
                
                    <ConstructInputs data={user.moreInformation} icon="detailsIcon" />

                    <ConstructInputs data={user.activityInformation} icon="documentIcon" />

                    <button className="btn btn--primary" style={{ margin: "20px", float: "right" }} onClick={this.saveChanges}>
                        {I18n.t('commons.save')}
                    </button>
                
                    <br/>

                </div>   
            )
        }

        return (
            <ContentPane>
                {componetRender}
            </ContentPane>            
        )
    }
}
UsersEditOne.propTypes = {
    history: PropTypes.object.isRequired,
    changeAction: PropTypes.func.isRequired,
    setNotification: PropTypes.func.isRequired,
    glpi: PropTypes.object.isRequired
}
