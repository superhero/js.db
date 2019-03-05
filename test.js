describe('db test', async () =>
{
  const
  expect  = require('chai').expect,
  context = require('mochawesome/addContext')

  before(function()
  {
    context(this, { title:'context', value:'placeholder' })
  })

  it('placeholder test', () =>
  {
    expect(1).to.be.equal(1)
  })
})
