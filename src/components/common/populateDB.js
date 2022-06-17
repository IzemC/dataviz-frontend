import axios from 'axios'
const api_url = 'http://localhost:8000'
import { csvParse } from 'd3'
// import genz from '../../assets/genZ.csv'
// import yp from '../../assets/young people.csv'


export default async function populateDB() {
    const raw1 = csvParse(yp)
    const raw2 = csvParse(genz)

    const data1 = raw1.map(d => ({
        date: d.date,
        MA_net_sent_ema_alpha_0_1: parseFloat(d['MA_net_sent_ema_alpha_0.1']),
        MA_net_sent_ema_alpha_0_3: parseFloat(d['MA_net_sent_ema_alpha_0.3']),
        MA_net_sent_ema_alpha_0_5: parseFloat(d['MA_net_sent_ema_alpha_0.5']),
        MA_logits: parseFloat(d['MA_logits']),
        MA_net_sent: parseFloat(d['MA_net_sent']),
        logits: parseFloat(d['logits']),
        logits_mean: parseFloat(d['logits_mean']),
        net_sent: parseFloat(d['net_sent']),
        net_sent_mean: parseFloat(d['net_sent_mean']),
    }))

    const data2 = raw2.map(d => ({
        sentence_entities: JSON.parse(d.sentence_entities.replaceAll("'", '"').replaceAll('\n', '').replaceAll('\\', '\\\\')),
        sentence_keywords: JSON.parse(d.sentence_keywords.replaceAll("'", '"').replaceAll('\n', '').replaceAll('\\', '\\\\')),
        sentence_non_entities: JSON.parse(d.sentence_non_entities.replaceAll("'", '"').replaceAll('\n', '').replaceAll('\\', '\\\\')),
        sentence_short: JSON.parse(d.sentence_short.replaceAll("'", '"').replaceAll('\n', '').replaceAll('\\', '\\\\')),
        sentence_sentiment: JSON.parse(d.sentence_sentiment),
        sentence_sent_score: parseFloat(d.sentence_sent_score),
        sentence_sentiment_label: parseInt(d.sentence_sentiment_label),
        sentence_sentiment_net: parseFloat(d.sentence_sentiment_net),
        category: d.category.includes('[') ? JSON.parse(d.category.replaceAll("'", '"').replaceAll('\n', '').replaceAll('\\', '\\\\'))[0] || '' : d.category,
        date: d.date.split('/').reverse().join('-'),
        sentence: d.sentence,
    }))

    for (let ob of data1) {
        await axios.post(`${api_url}/GenZ/`, ob)
    }
    for (let ob of data2) {
        await axios.post(`${api_url}/young_people/`, ob)
    }

}
