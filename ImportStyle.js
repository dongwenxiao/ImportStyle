import React, { Component } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'

import {
    append as appendStyle,
    remove as removeStyle,
    get as getStyle,
} from 'koot/React/styles'

/*
ImportStyle         适用于普通组件
ImportStyleRoot     适用于最外层组件
*/

// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
if (__CLIENT__) {
    (function (arr) {
        arr.forEach(function (item) {
            if (item.hasOwnProperty('remove')) {
                return;
            }
            Object.defineProperty(item, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function remove() {
                    this.parentNode.removeChild(this);
                }
            });
        });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
}

class StyleContainer extends Component {

    static contextTypes = {
        appendStyle: PropTypes.func,
        getStyle: PropTypes.func
    }

    render() {
        const styles = this.context.getStyle()

        let styleTagsString = ''
        for (let name in styles) {
            let id = name
            let s = removeStyleDot(styles[name].css)
            styleTagsString += `<style id=${id}>${s}</style>`
        }

        return (
            <div id="styleCollection" dangerouslySetInnerHTML={{ __html: styleTagsString }}></div>
        )
    }
}

export const ImportStyle = (styles) => (StyleWrappedComponent) => {

    class ImportStyle extends Component {

        static contextTypes = {
            appendStyle: PropTypes.func,
            removeStyle: PropTypes.func
        }

        constructor(props, context) {
            super(props, context)

            this.state = {}
            this.classNameWrapper = []
            this.styles = {}

            styles = stylesHandleWapperCssLoader(styles)
            styles.forEach((style) => {
                this.classNameWrapper.push(style.wrapper)
            })

            if (typeof appendStyle === 'function')
                appendStyle(styles)
            else if (__DEV__) {
                console.warn(`It seems that a component has no \`appendStyle\` function in \`context\`. Have you use \`ImportStyleRoot\` to the root component?`)
                console.warn('Related component: ', this)
            }
        }

        componentWillUnmount() {
            if (typeof removeStyle === 'function')
                removeStyle(styles)
        }

        render() {

            const props = {
                ...this.props,
                ...this.state
            }

            // this.origin = this.refs.origin
            if (__CLIENT__ && this.classNameWrapper instanceof HTMLElement) {
                this.classNameWrapper = [this.classNameWrapper.getAttribute('id')]
            }

            return (
                <StyleWrappedComponent
                    // ref='origin'
                    {...props}
                    // ref={el => this.origin = el}
                    className={this.classNameWrapper.concat(this.props.className).join(' ').trim()}
                    children={this.props.children}
                    data-class-name={this.classNameWrapper.join(' ')}
                />
            )
        }
    }

    return hoistStatics(ImportStyle, StyleWrappedComponent)
}

export const ImportStyleRoot = () => (StyleWrappedComponent) => {

    class ImportStyleRoot extends Component {

        constructor(props) {
            super(props)

            // this.styleMap = {}

            // this.checkAndWriteStyleToHeadTag = () => {

            //     for (let key in this.styleMap) {
            //         let styleObj = this.styleMap[key]
            //         if (styleObj.ref > 0) {
            //             // 配置样式
            //             if (!document.getElementById(key)) {
            //                 let styleTag = document.createElement('style')
            //                 styleTag.innerHTML = removeStyleDot(styleObj.css)
            //                 styleTag.setAttribute('id', key)
            //                 document.getElementsByTagName('head')[0].appendChild(styleTag)
            //             }
            //         } else {
            //             // 移除样式
            //             if (document.getElementById(key)) {
            //                 document.getElementById(key).remove()
            //             }
            //         }
            //     }
            // }
        }


        static childContextTypes = {
            appendStyle: PropTypes.func,
            removeStyle: PropTypes.func,
            getStyle: PropTypes.func
        }

        getChildContext = function () {
            return {
                appendStyle,
                removeStyle,
                getStyle
            }
        }

        render() {
            const props = {
                ...this.props,
                ...this.state
            }

            // this.origin = this.refs.origin

            return (
                <StyleWrappedComponent
                    // ref='origin'
                    // ref={el => this.origin = el}
                    {...props}
                >
                    {this.props.children}
                    {__SERVER__ && <StyleContainer />}
                </StyleWrappedComponent>
            )
        }
    }

    return ImportStyleRoot
}


// 统一处理，把string,object 都转化成array
const stylesHandleWapperCssLoader = (styles) => {

    // 如果是对象
    if (typeof styles === 'object' && !styles.length) {
        styles = [styles]
    }

    if (typeof styles === 'object' && styles.length) {
        return styles
    }

    throw 'stylesHandleWapperCssLoader() styles type must be array or object'
}

// 删除样式字符前后引号
// const removeStyleDot = (css) => css.substr(1, css.length - 2)
// 新版本的 wapper-style-loader 已经调，不需要做这步处理
const removeStyleDot = (css) => css
