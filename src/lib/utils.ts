import dayjs from 'dayjs'

export const formatearFecha = (fecha: Date | null) => dayjs(fecha).format('YYYY-MM-DD')