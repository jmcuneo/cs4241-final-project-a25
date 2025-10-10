class LegendItem {
    public title: string;
    public color: string;
    public isFor: (cases: number) => boolean;
    public textColor: string;

    constructor(title: string, color: string, isFor: (cases: number) => boolean, textColor: string){
        this.title = title
        this.color = color
        this.isFor = isFor
        this.textColor = textColor != null ? textColor : 'black'
    }
}

export default LegendItem