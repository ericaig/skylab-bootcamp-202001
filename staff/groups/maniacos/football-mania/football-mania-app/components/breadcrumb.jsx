const { Fragment } = React

function Breadcrumb({ items }) {
    return <Fragment>
        {items && <ul className="breadcrumb">
            {items.map((item, index) => <li key={index} className={`breadcrumb__item`} >
                {typeof item.breadcrumbClick === 'function' ?
                    <a href="" onClick={(event) => {
                        event.preventDefault()
                        item.breadcrumbClick()
                    }}>{item.title}</a> : 
                    <span>{item.title}</span>
                }
                <span className="breadcrumb__item-separator">{(index + 1) === items.length ? '' : '•'}</span>
            </li>)}
        </ul>}
    </Fragment>
}