export const margin = {
    top: 200,
    right: 30,
    bottom: 70,
    left: 30
};

export const datasets = [
    {
        name: 'young_people',
        label: 'Young people',
        type: 'graph',
        entityColor: '#1F85DE',
        categoryColor: '#03fcb1',
        keywordColor: '#3531e1',
        linkColor: '#7f93a5',
    },
    {
        name: 'genz',
        label: 'GenZ',
        type: 'plot',
        xAttrib: 'date',
        yAttrib: 'logits',
        style: 'bars',
        fillColor: '#1F85DE',
        axeColor: '#7f93a5'
    }
]

export const api_url =
    'https://dataviz.assameur.net/api/' ||
    'http://localhost:8000/'