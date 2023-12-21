import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderIcon from '../components/HeaderIcon';
import {useCurrentUser} from '../store/UserStore';
import {NavigationProp} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useQuery} from '@tanstack/react-query';
import {getUsers} from '../utils/user.util';
import {
  getCurrentMonth,
  getTotalExpense,
  getTotalExpensesOfEachUser,
} from '../utils/item.utils';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import * as Progress from 'react-native-progress';
import {queryClient} from '../App';
function getFormattedDate() {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const currentDate = new Date();
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return `${month} ${year}`;
}

function canculatePDFData(
  totalResultByMonth: Map<number, number> | undefined,
  totalExpensesOfEachUser: Map<number, number> | undefined,
  userDatas: {id: number; name: string}[] | [],
) {
  // console.log(totalResultByMonth, totalExpensesOfEachUser, userDatas);

  const PDFData: {name: string; spend: number; pay: number}[] = [];
  let totalSpend = 0;
  let totalPay = 0;
  userDatas.forEach(userData => {
    const spend = totalExpensesOfEachUser?.get?.(userData.id) ?? 0;
    const pay = totalResultByMonth?.get?.(userData.id) ?? 0;
    totalSpend += spend;
    totalPay += pay;
    PDFData.push({
      name: userData.name,
      spend: +spend.toFixed(2),
      pay: +(pay - spend).toFixed(2),
    });
  });

  const formattedDate = getFormattedDate();
  return {
    PDFData,
    totalSpend: +totalSpend.toFixed(2),
    totalPay: +totalPay.toFixed(2),
    month: formattedDate,
  };
}

const generatePDF = async (
  allPdfData: {
    PDFData: {name: string; spend: number; pay: number}[];
    totalSpend: number;
    totalPay: number;
    month: string;
  },
  setIsDownloading: (value: boolean) => void,
) => {
  try {
    const html = `
            <html>
      <html lang="en">
        <head>
          <style>
            body {
              font-family: "Helvetica";
              font-size: 12px;
            }
            header,
            footer {
              height: 30px;
              color: #000;
              display: flex;
              justify-content: center;
              margin-block: 60px;
              align-items: center;
              flex-direction: column;
            }
            table {
              width: 70%;
              border-collapse: collapse;
              margin-inline: auto;
            }
            th,
            td {
              border: 1px solid #000;
              padding: 18px;
            }
            th {
              background-color: #e9e9e9b0;
            }
          </style>
        </head>
        <body>
          <header>
            <h1 style="color: #1000f0; font-weight: bold">KISHAN KUNJ</h1>
            <h3>Bill For ${allPdfData.month}</h3>
          </header>
          <h1 style="text-align: center">Bill Details</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Spend</th>
                <th>Pay</th>
              </tr>
            </thead>
            <tbody>

            ${allPdfData.PDFData.map(
              item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.spend}</td>
                  <td>${item.pay}</td>
                </tr>
              `,
            ).join('')} 
            </tbody>
            <tfoot>
              <tr>
                <th >Total</th>
                <td>${allPdfData.totalSpend}</td>
                <td>${allPdfData.totalPay}</td>
              </tr>
            </tfoot>
          </table>
          <footer>
            <p>Thank you for your time!</p>
          </footer>
        </body>
      </html>
    </html>
          `;

    const options = {
      html,
      fileName: `KishanKunj-Bill-${allPdfData.month}`,
      directory: 'KishanKunj-Bills',
    };
    const file = await RNHTMLtoPDF.convert(options);

    // Get the path of the saved PDF
    const filePath = file.filePath;

    // Create a new folder if it doesn't exist
    const folderPath = `${RNFS.DownloadDirectoryPath}`;
    await RNFS.mkdir(folderPath);

    console.log(RNFS.DownloadDirectoryPath);

    await RNFS.moveFile(
      filePath as string,
      `${folderPath}/${options.fileName}.pdf`,
    );
    setIsDownloading(false);
    console.log(filePath);

    Alert.alert('Success', `PDF saved to ${folderPath}`);
    // const path = FileViewer.open(`${RNFS.DownloadDirectoryPath}`, {
    //   showOpenWithDialog: true,
    // }) // absolute-path-to-my-local-file.
    //   .then(() => {
    //     // success
    //   })
    //   .catch(error => {
    //     console.log(error);

    //     // error
    //   });
  } catch (error: any) {
    console.log(error);

    Alert.alert('Error', error.message);
    setIsDownloading(false);
  }
};

const ResultBox = ({
  user,
  totalExpense,
  allExpensesOfAUser,
}: {
  user: User | null;
  totalExpense: number | undefined;
  allExpensesOfAUser: number | undefined;
}) => {
  function getResult(n1: number | undefined, n2: number | undefined) {
    if (!n1 && !n2) return 0.0;
    if (!n1) return 0.0;
    if (!n2) return n1.toFixed(2);
    return (n1 - n2).toFixed(2);
  }

  return (
    <View style={styles.resultBox}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{uri: user?.image}}
          style={{
            width: 40,
            height: 40,
            borderRadius: 400 / 2,
          }}
        />
        <View style={{marginLeft: 5}}>
          <Text
            style={{
              fontSize: 11,

              color: 'black',
              fontWeight: 'bold',
            }}>
            {user?.fullName}
          </Text>
          <Text style={{fontSize: 11, color: 'black', opacity: 0.6}}>
            {user?.department}
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          alignSelf: 'flex-start',
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            fontSize: 11,
            marginBottom: 8,
            color: 'black',
            opacity: 0.6,
          }}>
          Total Expenses
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name={
              +getResult(totalExpense, allExpensesOfAUser) > 0
                ? 'minus'
                : 'plus'
            }
            size={15}
            color={
              +getResult(totalExpense, allExpensesOfAUser) > 0 ? 'red' : 'green'
            }
            style={{marginRight: 6}}
          />
          <Icon name="rupee" size={22} color="black" />
          <Text
            style={{
              fontSize: 25,
              color: 'black',
              fontWeight: 'bold',
              marginLeft: 1,
            }}>
            {Math.abs(+getResult(totalExpense, allExpensesOfAUser))}
          </Text>
        </View>
      </View>
    </View>
  );
};

const CalculationResultScreen = ({
  navigation,
}: {
  navigation: NavigationProp<any, any>;
}) => {
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const user = useCurrentUser(state => state.currentUser);
  const {data: userList} = useQuery<User[] | null>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const {data: totalResult} = useQuery<Map<number, number>>({
    queryKey: ['total_result'],
    queryFn: getTotalExpense,
  });

  const {data: totalExpensesOfEachUser} = useQuery<Map<number, number>>({
    queryKey: ['total_expenses'],
    queryFn: () => getTotalExpensesOfEachUser(),
    enabled: !!user?.id,
  });
  // console.log(totalResult);

  async function downloadPDF() {
    if (isDownloading) return;
    setIsDownloading(true);
    const allPdfData = canculatePDFData(
      totalResult,
      totalExpensesOfEachUser,
      userList?.map(user => {
        return {id: user.id, name: user.fullName};
      }) ?? [],
    );
    generatePDF(allPdfData, setIsDownloading);
  }

  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    queryClient.invalidateQueries({
      queryKey: ['total_result'],
    });
    queryClient.invalidateQueries({
      queryKey: ['total_expenses'],
    });
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);
  const renderItem = ({item}: {item: User}) => {
    return (
      <ResultBox
        user={item}
        allExpensesOfAUser={totalExpensesOfEachUser?.get?.(item.id) ?? 0}
        totalExpense={totalResult?.get?.(item.id) ?? 0}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.mainContainer}>
        <HeaderIcon user={user} back={true} navigation={navigation} />
        <View style={styles.contentSection}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 20,
              width: '100%',
              paddingLeft: 20,
            }}>
            <Text
              style={{
                color: '#000',
                flex: 1,
                fontSize: 20,
              }}>
              Calculation result
            </Text>
            <TouchableOpacity
              onPress={downloadPDF}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={styles.downloadPdfButton}>
                {!isDownloading ? (
                  <>
                    <Icon
                      name="download"
                      style={{marginRight: 10, marginTop: 3}}
                      size={18}
                      color="#fff"
                    />
                    <Text style={{fontSize: 14, color: '#fff'}}>
                      Download PDF
                    </Text>
                  </>
                ) : (
                  <Progress.Circle
                    color="white"
                    size={30}
                    indeterminate={true}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{color: '#000', paddingHorizontal: 30, fontSize: 10}}>
            {getCurrentMonth()}
          </Text>
          <View style={styles.resultContainer}>
            {userList?.length === 0 ? (
              <Text style={{marginTop: 20}}>No users found</Text>
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refresh}
                    onRefresh={onRefresh}
                    progressBackgroundColor={'#fff'}
                  />
                }
                contentContainerStyle={{alignItems: 'center'}}
                numColumns={2}
                data={userList}
                renderItem={renderItem}
                keyExtractor={item => item?.id?.toString() ?? ''}
              />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalculationResultScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  resultContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexWrap: 'wrap',
  },
  resultBox: {
    width: 150,
    height: 130,
    margin: 10,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 20,
    elevation: 5,
  },
  downloadPdfButton: {
    backgroundColor: '#1000F0',
    width: '70%',
    height: 40,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 8,
  },
});
