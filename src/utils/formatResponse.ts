export const successResponse = (req: any, res: any, entity: any, code: number, model?: string) => {
  if (!model) {
    return res.status(code).send(
      entity,
    )
  } else {

    return res.status(code).send({
      ...entity,
      message: req.t(`responses.${code}`, { name: model })
    })
  }
}

export const errorResponse = (req: any, res: any, entity: any, code: number, model?: string) => {
  if (!model) {
    return res.status(code).send({
      data: entity,
    })
  } else {

    return res.status(code).send({
      data: entity,
      message: req.t(`responses.${code}`, { name: model })
    })
  }
}

export const schemaFailResponse = (req: any, res: any, errors: any) => {
  return res.status(400).send({
    message: req.t('responses.400'),
    errors: errors
  })
}