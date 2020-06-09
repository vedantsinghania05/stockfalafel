import { resInternal, resOk, resNotFound, resNoContent, resCreated } from '../../services/response/'
import { Stock } from '.'

export const create = ({ body }, res, next) => {
	let fields = { symbol: body.symbol, date: body.date, open: body.open, high: body.high, low: body.low, close: body.close, volume: body.volume }
	
	Stock.create(fields)
		.then(stock => {
			if (!stock) return next(resInternal('Failed to create stock'))
			return resCreated(res, stock.view(true))
		})
		.catch(next)
}   