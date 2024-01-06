import { FONT_SIZE } from '@constants/ConfigConstants';
import { MuiDialog } from '@controls';
import { useModal, useWindowDimensions } from '@hooks';
import { Print } from '@mui/icons-material';
import { Button, DialogActions, Grid } from '@mui/material';
import { lotInformationService } from '@services';
import { ErrorAlert } from '@utils';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { useIntl } from 'react-intl';
import QRCode from 'react-qr-code';
import ChooseDevicePrintDialog from './ChooseDevicePrintDialog';

//   const Container = styled.div`
//   @media screen and (max-width: 768px) {
//     display: flex;
//     flex-direction: column;
//     padding-left: 10%;
//    padding-right: 10%;
//   }
// `;

const PrintLotDialog = ({ isOpen, onClose, data = [], showNumOfPrints = false }) => {
  const intl = useIntl();
  const [numberOfPrints, setNumberOfPrints] = useState(1);
  const { isShowing, toggle } = useModal();
  const { width } = useWindowDimensions();

  const [dataPrint, setDataPrint] = useState([]);
  const getDataPrint = async () => {
    const { Data } = await lotInformationService.getLotsPrint(data.map((x) => x.LOT_CD));
    setDataPrint(Data ?? []);
  };
  useEffect(() => {
    isOpen && getDataPrint();
  }, [isOpen, data]);

  const setTextFontSize = (width) => {
    if (width >= 1536) {
      return FONT_SIZE.REM_13;
    }

    if (1400 <= width && width < 1536) {
      return FONT_SIZE.REM_11;
    }

    if (1200 <= width && width < 1400) {
      return FONT_SIZE.REM_10;
    }

    if (900 <= width && width < 1200) {
      return FONT_SIZE.REM_9;
    }

    if (width < 900) {
      return FONT_SIZE.REM_7;
    }
  };

  const styles = {
    text: {
      fontSize: setTextFontSize(width),
      color: 'black',
      whiteSpace: 'nowrap',
    },
  };

  return (
    <>
      <MuiDialog
        maxWidth="xl"
        title={intl.formatMessage({ id: 'MaterialReceiving.PreviewPrint' })}
        isOpen={isOpen}
        disable_animate={300}
        onClose={onClose}
        footer={
          <DialogActions>
            <Button
              startIcon={<Print />}
              variant="contained"
              color="success"
              onClick={() => {
                if (!numberOfPrints || isNaN(numberOfPrints) || Number(numberOfPrints) <= 0) {
                  ErrorAlert(intl.formatMessage({ id: 'MaterialReceiving.NumberOfPrintsRequired' }));
                  return;
                }
                toggle();
              }}
            >
              Print Zebra
            </Button>
          </DialogActions>
        }
      >
        {/* {showNumOfPrints && (
          <Grid container spacing={2} marginTop={1} marginBottom={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                min={1}
                label={intl.formatMessage({ id: 'MaterialReceiving.NumberOfPrints' })}
                value={numberOfPrints}
                onChange={(e) => setNumberOfPrints(e.target.value)}
              />
            </Grid>
          </Grid>
        )} */}

        <Grid container spacing={2} style={width >= 624 ? { justifyContent: 'center', alignItems: 'center' } : null}>
          {dataPrint.map((x, index) => {
            const len = x.DESCRIPTION_LOC.length;
            const halfLen = Math.floor(len / 2);
            const arrPartName = [x.DESCRIPTION_LOC.substr(0, halfLen), x.DESCRIPTION_LOC.substr(halfLen)];
            return (
              <Grid item key={x.LOT_ID} style={{ border: '1px solid', margin: 5, padding: 10 }}>
                {/* <Grid item key={x.LOT_ID} style={{ border: '1px solid', width: '100%' }}   > */}
                <div
                  style={{
                    // position: 'absolute',
                    // zIndex: 100,
                    ...styles.text,
                    background: '#1976d2',
                    color: '#fff',
                    width: '30px',
                    height: '30px',
                    textAlign: 'center',
                    lineHeight: '32px',
                    borderRadius: '50%',
                  }}
                >
                  {index + 1}
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td width="22%" style={{ ...styles.text }}>
                        Part No
                      </td>
                      <td style={{ ...styles.text }}>
                        <Barcode
                          width={2}
                          height={50}
                          value={x.MATERIAL_NUMBER}
                          format="CODE128"
                          textPosition="top"
                          style={{ ...styles.text }}
                        />
                      </td>
                      <td rowSpan={3} className="pl-4">
                        <p className="mb-0" style={{ ...styles.text }}>
                          ESD
                        </p>
                        <table>
                          <tbody>
                            <tr>
                              <td style={{ ...styles.text, width: 85 }}>Plan</td>
                              <td style={{ ...styles.text }}>{x.PLANT_CODE}</td>
                            </tr>
                            <tr>
                              <td style={{ ...styles.text }}>Location</td>
                              <td style={{ ...styles.text }}>{x.SL_CD}</td>
                            </tr>
                            <tr>
                              <td colSpan={2} className="text-center" style={{ ...styles.text }}>
                                {x.ITEM_ACCT}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.text }}>Part name</td>
                      <td style={{ ...styles.text }}>
                        <p className="mb-0">{arrPartName[0]}</p>
                        <p className="mb-0">{arrPartName[1]}</p>
                      </td>
                    </tr>
                    <tr style={{ ...styles.text }}>
                      <td>Qty</td>
                      <td colSpan={2}>{x.TOTAL_QTY}</td>
                    </tr>
                    <tr style={{ ...styles.text }}>
                      <td>Lot code</td>
                      <td colSpan={2}>{x.LOT_CD}</td>
                    </tr>
                    <tr style={{ ...styles.text }}>
                      <td>
                        Receiving <br />
                        Date
                      </td>
                      <td colSpan={2} style={{ ...styles.text }}>
                        {moment(x.createdDate).format('YYYY-MM-DD')}
                      </td>
                    </tr>
                    <tr style={{ ...styles.text }}>
                      <td>Vendor</td>
                      <td>{x.BP_NM}</td>
                      <td rowSpan={3} className="pl-4">
                        <QRCode size={100} value={x.LOT_CD} />
                      </td>
                    </tr>
                    <tr style={{ ...styles.text }}>
                      <td>MFG Date</td>
                      <td>{x.MFG_DT ? moment(x.MFG_DT).format('YYYY-MM-DD') : ''}</td>
                    </tr>
                    <tr style={{ ...styles.text }}>
                      <td>Original</td>
                      <td>{x.ORIGIN_CODE}</td>
                    </tr>
                  </tbody>
                </table>
                {/* </Grid> */}
              </Grid>
            );
          })}
        </Grid>
      </MuiDialog>

      <ChooseDevicePrintDialog isOpen={isShowing} onClose={toggle} data={dataPrint} />
    </>
  );
};

export default PrintLotDialog;
