import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import numberWithCommas from "../../utils/numberWithCommas"

function PresentPdf({ eventData, data }) {

    return (
        <Document>
            <Page
                size="A4"
                style={{
                    flex: 1,
                    padding: 20,
                    paddingBottom: 30
                }}
                wrap
            >
                {/* Header */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginBottom: 5
                }}>
                    <Image
                        source={{ uri: eventData.image }}
                        style={{ width: 100 }}
                    />
                    {/* Middle */}
                    <View style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        paddingHorizontal: 5
                    }}>
                        {/* Details */}
                        <View>
                            <Text style={{ fontSize: 17, textAlign: 'center' }}>{eventData.name}</Text>
                            <Text style={{ fontSize: 10, textAlign: 'center' }}>{eventData.agenda}</Text>
                        </View>

                        <View>
                            {/* date time */}
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <Text style={{ fontSize: 10 }}>Date: {moment(eventData.date).format('LL')}</Text>
                                <Text style={{ fontSize: 10 }}>Time: {moment(eventData.start).format('LT')} - {moment(eventData.end).format('LT')}</Text>
                            </View>

                            {/* Total */}
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{ fontSize: 10 }}>Total Present: {data.length}</Text>
                                <Text style={{ fontSize: 10 }}>Total Unit: {numberWithCommas(data.reduce((accumulator, current) => accumulator + Number(current.unit), 0))}</Text>
                            </View>
                        </View>
                    </View>
                    <Image
                        src="../../assets/bgiclogo.png"
                        style={{ width: 100 }}
                    />
                </View>

                {/* Table */}
                <View style={styles.table} >
                    {/* Header Row */}
                    <View style={styles.tableRow} fixed>
                        <Text style={{ ...styles.tableCellHeader, width: 40 }}></Text>
                        <Text style={{ ...styles.tableCellHeader, width: 130 }}>BOID</Text>
                        <Text style={{ ...styles.tableCellHeader, flex: 1 }}>Name</Text>
                        <Text style={{ ...styles.tableCellHeader, width: 70 }}>Unit</Text>
                        <Text style={{ ...styles.tableCellHeader, width: 65 }}>Time</Text>
                    </View>

                    {/* Data Rows */}
                    {
                        data.map((row, index) => (
                            <View style={styles.tableRow} key={index} wrap={false}>
                                <Text style={{ ...styles.tableCell, width: 40 }}>{index + 1}</Text>
                                <Text style={{ ...styles.tableCell, width: 130 }}>{row.boid}</Text>
                                <Text style={{ ...styles.tableCell, flex: 1, textAlign: 'left', paddingHorizontal: 5 }}>{row.name}</Text>
                                <Text style={{ ...styles.tableCell, width: 70, textAlign: 'right' }}>{numberWithCommas(Number(row.unit))}</Text>
                                <Text style={{ ...styles.tableCell, width: 65 }}>{moment(row.time2).format('LT')}</Text>
                            </View>
                        ))
                    }
                </View>

                {/* Page Number */}
                <Text style={{
                    position: 'absolute',
                    fontSize: 10,
                    bottom: 10,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                }} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}

// Create styles
const styles = StyleSheet.create({
    table: {
        display: 'flex',
        width: '100%',
        borderStyle: 'solid',
        // borderWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCellHeader: {
        backgroundColor: '#bfbfbf',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#a8a8a8',
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 3,
        fontWeight: 'bold',
        fontSize: 10
    },
    tableCell: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 3,
        fontSize: 10
    },
    cellImage: {
        width: 90
    }
});

export default PresentPdf

