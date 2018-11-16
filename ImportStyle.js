import React, { Component } from 'react'
import hoistStatics from 'hoist-non-react-statics'

import {
    append as appendStyle,
    remove as removeStyle,
    StyleMapContext,
} from 'koot/React/styles'

export const ImportStyle = (_styles) => (WrappedComponent) => {

    const styles = (!Array.isArray(_styles) ? [_styles] : styles).filter(obj => (
        typeof obj === 'object' && typeof obj.wrapper === 'string'
    ))

    const hasStyles = (
        Array.isArray(styles) &&
        styles.length > 0
    )

    class ImportStyle extends Component {

        static contextType = StyleMapContext

        constructor(props, context) {
            super(props, context)

            if (hasStyles) {
                this.kootClassNames = styles.map(obj => obj.wrapper)
                appendStyle(context, styles)
                // console.log('----------')
                // console.log('styles', styles)
                // console.log('theStyles', theStyles)
                // console.log('this.classNameWrapper', this.classNameWrapper)
                // console.log('----------')
            }
        }

        componentWillUnmount() {
            if (hasStyles) {
                removeStyle(this.context, styles)
            }
        }

        render() {
            // console.log('styles', styles)
            // console.log('this', this)
            // console.log('this.kootClassNames', this.kootClassNames)
            // console.log('this.props.className', this.props.className)
            if (__CLIENT__ && this.kootClassNames instanceof HTMLElement) {
                // console.log(this.kootClassNames)
                this.kootClassNames = [this.kootClassNames.getAttribute('id')]
            }
            const props = Object.assign({}, this.props, {
                className: this.kootClassNames.concat(this.props.className).join(' ').trim(),
                "data-class-name": this.kootClassNames.join(' ').trim(),
            })
            return <WrappedComponent {...props} />
        }
    }

    return hoistStatics(ImportStyle, WrappedComponent)
}

export default ImportStyle
