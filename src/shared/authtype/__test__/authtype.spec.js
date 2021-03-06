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

import authtype from '../index.js'

describe('authtype', () => {
  it('should return "glpi_internal_database"', () => {
    expect(authtype(1)).toEqual('glpi_internal_database')
  })

  it('should return "mail_server"', () => {
    expect(authtype(2)).toEqual('mail_server')
  })

  it('should return "ldap_directory"', () => {
    expect(authtype(3)).toEqual('ldap_directory')
  })

  it('should return "other"', () => {
    expect(authtype(4)).toEqual('other')
  })

  it('should return "cas"', () => {
    expect(authtype(5)).toEqual('cas')
  })

  it('should return "certificate_authentication"', () => {
    expect(authtype(6)).toEqual('certificate_authentication')
  })

  it('should return "api"', () => {
    expect(authtype(7)).toEqual('api')
  })

  it('should return "cookie"', () => {
    expect(authtype(8)).toEqual('cookie')
  })

  it('should return "not_yet_authenticated"', () => {
    expect(authtype(0)).toEqual('not_yet_authenticated')
  })

  it('should return "not_available"', () => {
    expect(authtype(-1)).toEqual('not_available')
  })
})