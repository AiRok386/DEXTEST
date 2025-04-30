const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(compression());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
  