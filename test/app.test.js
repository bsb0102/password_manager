import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; // Import the default export from app.js


const expect = chai.expect;

chai.use(chaiHttp);

describe('Express App', () => {
  it('GET / should return Hello World', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello World!');
        done();
      });
  });

});
