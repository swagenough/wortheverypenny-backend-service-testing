import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Jakarta');

console.log({ moment: moment() })

const waktu = "2025-03-12T08:30:11.677+00:00"
console.log({ moment: moment(waktu)})

console.log(moment().isSameOrAfter(moment(waktu)));