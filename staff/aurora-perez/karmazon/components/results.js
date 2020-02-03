class Results extends Component {

    constructor({ results, onItemClick}) {

        super(document.createElement('ul'))

        const list = this.container

        list.classList.add('results')

        results.forEach(function (element) {
            const item = new Item({
                element,

                onClick: onItemClick
            })
            
            list.append(item.container)
        })
    }
}
