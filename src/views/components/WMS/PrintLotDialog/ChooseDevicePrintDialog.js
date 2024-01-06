import { MuiButton, MuiDialog } from '@controls';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { ErrorAlert } from '@utils';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const ChooseDevicePrintDialog = ({ isOpen, onClose, data = [], numberOfPrints = 1 }) => {
  const intl = useIntl();

  const btnRef_printChooseDevicePrintDialog = useRef();

  const [deviceList, setDeviceList] = useState([]);
  const [printer, setPrinter] = useState(null);

  const [dialogState, setDialogState] = useState({
    isSubmit: false,
  });

  const setupPrinter = () => {
    window.BrowserPrint.getLocalDevices(
      (device_list) => {
        const data = [];
        for (let i = 0; i < device_list.length; i++) {
          let device = device_list[i];
          data.push(device);
        }
        setDeviceList(data);
      },
      () => {
        ErrorAlert(intl.formatMessage({ id: 'general.cannot_connect_printer' }));
        setDeviceList([]);
      },
      'printer'
    );
  };

  useEffect(() => {
    isOpen && setupPrinter();
  }, [isOpen]);

  const handleCloseDialog = () => {
    setDialogState({
      ...dialogState,
    });
    onClose();
  };

  const writeToSelectedPrinter = (dataToPrint) => {
    if (printer) printer.send(dataToPrint, undefined, errorPrintCallback);
    else ErrorAlert(intl.formatMessage({ id: 'general.not_select_printer' }));
  };

  const errorPrintCallback = (errorMessage) => {
    alert('Error: ' + errorMessage);
  };

  const handlePrint = async () => {
    let txt = `
    CT~~CD,~CC^~CT~
    ^XA
    ~TA000
    ~JSN
    ^LT0
    ^MNW
    ^MTT
    ^PON
    ^PMN
    ^LH0,0
    ^JMA
    ^PR6,6
    ~SD20
    ^JUS
    ^LRN
    ^CI27
    ^PA0,1,1,0
        `;
    const nOP = isNaN(numberOfPrints) || Number(numberOfPrints) <= 0 ? 1 : Number(numberOfPrints);
    data.forEach((item) => {
      const len = item.DESCRIPTION_LOC.length;
      const halfLen = Math.floor(len / 2);
      const arrPartName = [item.DESCRIPTION_LOC.substr(0, halfLen), item.DESCRIPTION_LOC.substr(halfLen)];

      for (let index = 0; index < nOP; index++) {
        txt += `
      ^XZ
      ^XA
      ^MMT
      ^PW1181
      ^LL591
      ^LS0
      ^FPH,1^FT15,74^A0N,33,33\^CI28^FDPart No^FS^CI27
      ^FT961,78^A0N,33,33\^CI28^FDESDFS^CI27
      ^FT15,170^A0N,33,33\^CI28^FDPart name^FS^CI27
      ^FT15,266^A0N,33,33\^CI28^FDQ'ty^FS^CI27
      ^FT183,266^A0N,33,33\^CI28^FD${item.TOTAL_QTY}^FS^CI27
      ^FT183,164^A0N,29,28\^CI28^FD${arrPartName[0]}^FS^CI27
      ^FT183,200^A0N,29,28\^CI28^FD${arrPartName[1]}^FS^CI27
      ^FT933,145^A0N,33,33\^CI28^FDPLANT^FS^CI27
      ^FT1057,145^A0N,33,33\^CI28^FD${item.PLANT_CODE}^FS^CI27
      ^FT15,328^A0N,33,33\^CI28^FDLot Code^FS^CI27
      ^FT183,328^A0N,33,33\^CI28^FD${item.LOT_CD}^FS^CI27
      ^FT999,246^A0N,33,33\^CI28^FD${item.ITEM_ACCT}^FS^CI27
      ^FT15,385^A0N,33,35\^CI28^FDReceived Date^FS^CI27
      ^FT255,385^A0N,33,35\^CI28^FD${item.createdDate}^FS^CI27
      ^FT15,441^A0N,33,35\^CI28^FDVENDOR^FS^CI27
      ^FT183,437^A0N,36,38\^CI28^FD${item.BP_NM}^FS^CI27
      ^FT15,501^A0N,33,35\^CI28^FDMFG Date^FS^CI27
      ^FT183,501^A0N,33,35\^CI28^FD${item.MFG_DT}^FS^CI27
      ^FT15,561^A0N,33,35\^CI28^FDOriginal^FS^CI27
      ^FT183,561^A0N,33,35\^CI28^FD${item.ORIGIN_CODE}^FS^CI27
      ^FT933,199^A0N,33,33\^CI28^FDLocation^FS^CI27
      ^FT1064,199^A0N,33,33\^CI28^FD${item.SL_CD}^FS^CI27
      ^BY4,3,59^FT203,94^BCN,,Y,N
      \^FD>:${item.MATERIAL_NUMBER}^FS
      ^FT899,596^BQN,2,10
      \^FDLA,${item.LOT_CD}^FS
      ^PQ1,0,1,Y
      ^XZ

      `;
      }
    });

    writeToSelectedPrinter(txt);
  };
  return (
    <MuiDialog
      maxWidth="sm"
      title={intl.formatMessage({ id: 'general.print' })}
      isOpen={isOpen}
      disabledCloseBtn={dialogState.isSubmit}
      disable_animate={300}
      onClose={handleCloseDialog}
    >
      <form>
        <Grid container rowSpacing={2.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <Autocomplete
              options={deviceList}
              getOptionLabel={(device) => `${device?.name} `}
              onChange={(e, value) => setPrinter(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label={intl.formatMessage({ id: 'general.choose_printer' })}
                  name="device"
                  variant="outlined"
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container direction="row-reverse">
              <MuiButton
                permission="allowAll"
                ref={btnRef_printChooseDevicePrintDialog}
                btnText="print"
                onClick={handlePrint}
              />
            </Grid>
          </Grid>
        </Grid>
      </form>
    </MuiDialog>
  );
};

export default ChooseDevicePrintDialog;
