import WinJS from 'winjs'
import { I18n } from 'react-i18nify'

export default function (dataSource, index = 0) {
    const groupKey = function (data) {
        try {
            return (data[Object.keys(data)[index]])[0].toUpperCase()
        } catch (error) {
            return (I18n.t('commons.n/a'))
        }
    }

    const groupData = function (data) {
        return { title: groupKey(data) }
    }

    const groupSorted = function (a, b) {
        if (dataSource.order === 'ASC') {
            if (a < b) {
                return -1
            } else if (a > b) {
                return 1
            } else {
                return 0
            }
        } else {
            if (a > b) {
                return -1
            } else if (a < b) {
                return 1
            } else {
                return 0
            }
        }
    }

    const sorter = (a, b) => {
        if (a[Object.keys(a)[0]] < b[Object.keys(b)[0]]) {
            return -1
        } else if (a[Object.keys(a)[0]] > b[Object.keys(b)[0]]) {
            return 1
        } else {
            return 0
        }
    }

    if (dataSource.data) {
        return new WinJS.Binding.List(dataSource.data)
            .createSorted(sorter)
            .createGrouped(groupKey, groupData, groupSorted)
    }
}