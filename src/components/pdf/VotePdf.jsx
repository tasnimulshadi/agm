import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import moment from 'moment';
import numberWithCommas from "../../utils/numberWithCommas"

function VotePdf({ eventData, data }) {

    function calculatePercentage(part, whole) {
        const res = (part / whole) * 100
        return res.toFixed(2);
    }

    // Calculate the total number of voters (length of the data array)
    const total_voter = data.length;
    const total_voted = data.reduce((accumulator, current) => accumulator + (current.vote !== '' ? 1 : 0), 0);
    // Calculate the total units voted by all voters (sum of 'unit' property for each entry)
    const total_voter_unit = data.reduce((accumulator, current) => accumulator + Number(current.unit), 0);

    // Calculate the number of 'yes' votes
    const yes_vote = data.reduce((accumulator, current) => accumulator + (current.vote === 'yes' ? 1 : 0), 0);
    // Calculate the percentage of 'yes' votes
    const yes_vote_percentage = calculatePercentage(yes_vote, total_voter);
    // Calculate the total units associated with 'yes' votes
    const yes_vote_unit = data.reduce((accumulator, current) => accumulator + (current.vote === 'yes' ? Number(current.unit) : 0), 0);
    // Calculate the percentage of total units contributed by 'yes' votes
    const yes_vote_unit_percentage = calculatePercentage(yes_vote_unit, total_voter_unit);

    // Calculate the number of 'no' votes
    const no_vote = data.reduce((accumulator, current) => accumulator + (current.vote === 'no' ? 1 : 0), 0);
    // Calculate the percentage of 'no' votes
    const no_vote_percentage = calculatePercentage(no_vote, total_voter);
    // Calculate the total units associated with 'no' votes
    const no_vote_unit = data.reduce((accumulator, current) => accumulator + (current.vote === 'no' ? Number(current.unit) : 0), 0);
    // Calculate the percentage of total units contributed by 'no' votes
    const no_vote_unit_percentage = calculatePercentage(no_vote_unit, total_voter_unit);

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

                            {/* Total Present */}
                            {/* <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <Text style={{ fontSize: 10 }}>Total Present: {data.length}</Text>
                                <Text style={{ fontSize: 10 }}>Total Unit: {data.reduce((accumulator, current) => accumulator + Number(current.unit), 0)}</Text>
                            </View> */}
                        </View>
                    </View>
                    <Image
                        src="../../assets/bgiclogo.png"
                        style={{ width: 100 }}
                    />
                </View>

                {/* Vote */}
                <View style={{ marginVertical: 5 }}>
                    {/* Total */}
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{ fontSize: 10 }}>Total Votes: {total_voted} / {total_voter}</Text>
                        <Text style={{ fontSize: 10 }}>Total Unit: {numberWithCommas(total_voter_unit)}</Text>
                    </View>

                    {/* YES */}
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{ fontSize: 10 }}>Yes Votes: {yes_vote} , ( {yes_vote_percentage}% )</Text>
                        <Text style={{ fontSize: 10 }}>Yes Votes Unit: {numberWithCommas(yes_vote_unit)} , ( {yes_vote_unit_percentage}% )</Text>
                    </View>

                    {/* NO */}
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text style={{ fontSize: 10 }}>No Votes: {no_vote} , ( {no_vote_percentage}% )</Text>
                        <Text style={{ fontSize: 10 }}>No Votes Unit: {numberWithCommas(no_vote_unit)} , ( {no_vote_unit_percentage}% )</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table} >
                    {/* Header Row */}
                    <View style={styles.tableRow} fixed>
                        <Text style={{ ...styles.tableCellHeader, width: 40 }}></Text>
                        <Text style={{ ...styles.tableCellHeader, width: 130 }}>BOID</Text>
                        <Text style={{ ...styles.tableCellHeader, flex: 1 }}>Name</Text>
                        <Text style={{ ...styles.tableCellHeader, width: 70 }}>Unit</Text>
                        <Text style={{ ...styles.tableCellHeader, width: 65 }}>Vote</Text>
                        {/* <Text style={{ ...styles.tableCellHeader, width: 65 }}>Time</Text> */}
                    </View>

                    {/* Data Rows */}
                    {
                        data.map((row, index) => (
                            <View style={styles.tableRow} key={index} wrap={false}>
                                <Text style={{ ...styles.tableCell, width: 40 }}>{index + 1}</Text>
                                <Text style={{ ...styles.tableCell, width: 130 }}>{row.boid}</Text>
                                <Text style={{ ...styles.tableCell, flex: 1, textAlign: 'left', paddingHorizontal: 5 }}>{row.name}</Text>
                                <Text style={{ ...styles.tableCell, width: 70, textAlign: 'right' }}>{numberWithCommas(Number(row.unit))}</Text>
                                <Text style={{ ...styles.tableCell, width: 65, }}>{row.vote.toUpperCase()}</Text>
                                {/* <Text style={{ ...styles.tableCell, width: 65 }}>{moment(row.time2).format('LT')}</Text> */}
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

export default VotePdf

