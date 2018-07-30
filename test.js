describe('MySQL test', async () =>
{
  const
  expect  = require('chai').expect,
  context = require('mochawesome/addContext')

  before(function(done)
  {
    context(this, { title:'context', value:'placeholder' })
  })

  after(() => server.close())

  it('placeholder test', () =>
  {
    expect(1).to.be.equal(1)
  })
})
