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

import { I18n } from 'react-i18nify'
import EmptyMessage from '../../components/EmptyMessage'
import Overview from './components/Overview/'
import SystemInformation from './components/SystemInformation/'
import HelpCenter from './components/HelpCenter/'
import Contact from './components/Contact/'
import ReleaseNotes from './components/ReleaseNotes'
import TermsOfUse from './components/TermsOfUse'
import Licence from './components/License'

const routes = [
  {
    path: '/',
    name: I18n.t('commons.no_selection'),
    component: EmptyMessage,
    exact: true
  },
  {
    path: '/overview',
    name: I18n.t('about.overview.title'),
    component: Overview,
    exact: true
  },
  {
    path: '/system',
    name: I18n.t('about.system_information.title'),
    component: SystemInformation,
    exact: false
  },
  {
    path: '/help',
    name: I18n.t('about.help_center.title'),
    component: HelpCenter,
    exact: false
  },
  {
    path: '/contact',
    name: I18n.t('about.contact.title'),
    component: Contact,
    exact: false
  },
  {
    path: '/release',
    name: I18n.t('about.release_notes.title'),
    component: ReleaseNotes,
    exact: false
  },
  {
    path: '/term',
    name: I18n.t('about.term_of_use.title'),
    component: TermsOfUse,
    exact: false
  },
  {
    path: '/license',
    name: I18n.t('about.license.title'),
    component: Licence,
    exact: false
  }
]

export default routes